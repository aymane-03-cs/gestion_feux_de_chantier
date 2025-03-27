import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FeuService } from '../../services/feu.service';
import { AlertService } from '../../services/alert.service';

import { Chart, registerables } from 'chart.js';

// pdfMake is declared globally by the scripts in angular.json
declare var pdfMake: any;

@Component({
  selector: 'app-analyse-reports',
  templateUrl: './analyse-reports.component.html',
})
export class AnalyseReportsComponent implements OnInit, OnDestroy {
  // Dashboard counters
  totalFeuxActifs = 0;
  totalAlertes = 0;
  totalInterventions = 0;

  // Chart-related properties
  private chartInstance: Chart | null = null;
  private chartData: number[] = [];
  private chartLabels: string[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private feuService: FeuService,
    private alertService: AlertService
  ) {
    // Register all the Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Only run this in the browser (avoid SSR errors)
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
    }
  }

  private loadInitialData(): void {
    // 1) Fetch Feux
    this.feuService.getAllFeux().subscribe(feux => {
      this.totalFeuxActifs = feux.length;
    });

    // 2) Fetch Alerts
    this.alertService.getWarnings().subscribe(alerts => {
      this.totalAlertes = alerts.filter(a => !a.date_resolution).length;
      this.totalInterventions = alerts.filter(a => a.date_resolution).length;

      // Prepare the chart data
      this.prepareChartData(alerts);

      // Initialize the chart
      this.initChart();
    });
  }

  private prepareChartData(alerts: any[]): void {
    const monthlyData = new Map<string, number>();
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    // Increment count per month
    alerts.forEach(alert => {
      const date = new Date(alert.date_alerte);
      const month = mois[date.getMonth()];
      monthlyData.set(month, (monthlyData.get(month) || 0) + 1);
    });

    // Only up to current month
    const currentMonthIndex = new Date().getMonth();
    this.chartLabels = mois.slice(0, currentMonthIndex + 1);

    // Map data to labels
    this.chartData = this.chartLabels.map(label => monthlyData.get(label) || 0);
  }

  private initChart(): void {
    // Destroy existing chart if present
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const canvas = document.getElementById('alertChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Alertes par mois',
          data: this.chartData,
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre d\'alertes'
            }
          }
        }
      }
    });
  }

  async exporterRapport(): Promise<void> {
    // Current date
    const date = new Date().toLocaleDateString('fr-FR');

    // Build doc definition
    const docDefinition: any = {
      content: [
        {
          text: `Rapport d'activité - ${date}`,
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 20],
          alignment: 'center'
        },
        {
          ul: [
            `Feux actifs: ${this.totalFeuxActifs}`,
            `Alertes en cours: ${this.totalAlertes}`,
            `Interventions réalisées: ${this.totalInterventions}`
          ],
          margin: [0, 0, 0, 20]
        },
        // Embed chart image if available
        ...(this.chartInstance ? [{
          image: this.chartInstance.toBase64Image(),
          width: 500,
          height: 250,
          margin: [0, 0, 0, 20]
        }] : []),
        {
          text: 'Généré par le système de gestion des feux',
          fontSize: 10,
          color: '#666666',
          margin: [0, 20],
          alignment: 'center'
        }
      ]
    };

    // Generate and download PDF
    pdfMake.createPdf(docDefinition).download(`rapport-feux-${date}`);
  }

  ngOnDestroy(): void {
    // Clean up the chart
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
