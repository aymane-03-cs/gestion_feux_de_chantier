import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { Alert, Criticite } from '../../model/alert.model';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AlertListComponent implements OnInit {
  originalAlerts: Alert[] = [];
  filteredAlerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  private loadAlerts(): void {
    this.alertService.getWarnings().subscribe({
      next: (data) => {
        console.log("📢 Alertes reçues du backend:", data);
        // Formate chaque alerte pour afficher les dates correctement
        this.originalAlerts = data.map(a => this.formatAlert(a));
        this.filteredAlerts = [...this.originalAlerts];
      },
      error: (err) => console.error('❌ Erreur de chargement:', err)
    });
  }

  getStatusClass(criticite: Criticite): string {
    const classMap: Record<Criticite, string> = {
      'CRITIQUE': 'bg-danger text-white',
      'MAJEURE': 'bg-warning text-dark',
      'MINEURE': 'bg-info text-dark'
    };
    return `${classMap[criticite]} badge rounded-pill`;
  }

  /**
   * Formate les dates de l’alerte pour l’affichage.
   */
  private formatAlert(alert: Alert): Alert {
    return {
      ...alert,
      date_alerte: alert.date_alerte ? this.formatDate(alert.date_alerte) : '',
      date_resolution: alert.date_resolution ? this.formatDate(alert.date_resolution) : undefined
    };
  }

  /**
   * Convertit une chaîne de date en format local français.
   */
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  resolveAlert(alertId: number): void {
    if (confirm('Confirmer la résolution de cette alerte ?')) {
      const index = this.originalAlerts.findIndex(a => a.id_alerte === alertId);
      if (index > -1) {
        // Mise à jour locale de la date de résolution
        this.originalAlerts[index].date_resolution = this.formatDate(new Date().toISOString());
        
        // Mise à jour aussi dans la liste filtrée
        this.filterAlerts({ target: { value: 'TOUTES' } } as unknown as Event);
      }
    }
  }
  

  filterAlerts(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filteredAlerts = value === 'TOUTES' ? 
      [...this.originalAlerts] : 
      this.originalAlerts.filter(a => a.criticite === value);
  }

  getAlertTypeLabel(type: Alert['type_alerte']): string {
    const labels: Record<string, string> = {
      'BATTERIE': 'Batterie',
      'OPTIQUE': 'Optique',
      'POSITION': 'Position',
      'FONCTIONNEMENT': 'Fonctionnement'
    };
    return labels[type] || 'Inconnu';
  }
}
