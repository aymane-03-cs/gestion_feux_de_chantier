import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { AlertListComponent } from '../alert-list/alert-list.component';
import { DashboardService } from '../../services/mock-dashboard.service';
import { Feu } from '../../model/feu.model';
import { MetricsService } from '../../services/metrics.service';
import { FeuService } from '../../services/feu.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  feux: Feu[] = [];
  totalFeux = 0;
  totalAlertes = 0;
  totalInterventions = 0;
  totalDefauts = 0;
  batteryStats: Record<string, number> = {};
  functionStats: Record<string, number> = {};

  private batteryChart: any;
  private functionChart: any;

  constructor(
    private feuService: FeuService,
    private metricsService: MetricsService
  ) {}

  ngOnInit(): void {
    this.feuService.getAllFeux().subscribe((data: Feu[]) => {
      this.feux = data;
      this.processMetrics();
      this.loadBatteryChart();
      this.loadFunctionChart();
    });
  }

  ngAfterViewInit(): void {
    this.loadBatteryChart();
    this.loadFunctionChart();
  }

  processMetrics(): void {
    const metrics = this.metricsService.computeMetrics(this.feux);
    this.totalFeux = metrics.totalFeux;
    this.totalAlertes = metrics.totalAlertes.length; 
    this.totalInterventions = metrics.totalInterventions;
    this.totalDefauts = metrics.totalDefauts;
    this.batteryStats = metrics.batteryStats;
    this.functionStats = metrics.functionStats;
  }

  loadBatteryChart(): void {
    const ctx = document.getElementById('batteryChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.batteryChart) this.batteryChart.destroy();

      this.batteryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.batteryStats),
          datasets: [{
            data: Object.values(this.batteryStats),
            backgroundColor: ['#28a745', '#ffc107', '#fd7e14', '#dc3545', '#6c757d']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  loadFunctionChart(): void {
    const ctx = document.getElementById('functionChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.functionChart) this.functionChart.destroy();

      this.functionChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.functionStats),
          datasets: [{
            label: 'Nombre de feux',
            data: Object.values(this.functionStats),
            backgroundColor: ['#17a2b8', '#ffc107', '#dc3545']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }
}
