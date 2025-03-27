import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserRoles } from '../model/user.model';


export type AlertType = 'BATTERIE' | 'OPTIQUE' | 'POSITION' | 'FONCTIONNEMENT';
export type Criticite = 'CRITIQUE' | 'MAJEURE' | 'MINEURE';

export interface Alert {
  id_alerte: number;
  id_feu: number;
  type_alerte: AlertType;
  date_alerte: string;
  date_resolution?: string;
  description: string;
  criticite: Criticite;
  num_serie: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = 'http://localhost:5000/api/alerts'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**  Récupère et adapte les alertes depuis le backend */
  getWarnings(): Observable<Alert[]> {
    const role = this.authService.getUserRole();
    const userId = this.authService.getUserId();
  
    let url = this.apiUrl;
  
    if (role === UserRoles.USER) {
      url = `${this.apiUrl}/user/${userId}`;
    } else if (role === UserRoles.VISITOR) {
      url = `${this.apiUrl}/visitor/${userId}`;
    }
  
    return this.http.get<{ batteryWarnings: any[], opticsWarnings: any[] }>(url).pipe(
      map(response => this.transformWarnings(response)),
      catchError(err => {
        console.error('❌ Erreur lors de la récupération des alertes:', err);
        return throwError(() => new Error('Impossible de récupérer les alertes'));
      })
    );
  }
  

  /**  Transforme les alertes du backend en format `Alert[]` */
  private transformWarnings(data: { batteryWarnings: any[], opticsWarnings: any[] }): Alert[] {
    let transformedAlerts: Alert[] = [];

    //  Transforme les alertes batterie
    transformedAlerts = transformedAlerts.concat(data.batteryWarnings.map(battery => ({
      id_alerte: battery.id_etat_batterie,  // On peut utiliser l'ID de la batterie
      id_feu: battery.id_feu,
      type_alerte: 'BATTERIE' as AlertType,
      date_alerte: battery.date_enregistrement_batterie,
      description: `Batterie ${battery.type_etat_batterie} (${battery.autonomie_restante} restantes)`,
      criticite: battery.type_etat_batterie === 'Vide' ? 'CRITIQUE' : 'MAJEURE',
      num_serie: `F${1000 + battery.id_feu}`
    })));

    // 💡 Transforme les alertes optiques
    transformedAlerts = transformedAlerts.concat(data.opticsWarnings.map(optics => ({
      id_alerte: optics.id_etat_optique,
      id_feu: optics.id_feu,
      type_alerte: 'OPTIQUE' as AlertType,
      date_alerte: optics.date_enregistrement_optiques,
      description: `État optique : Bas=${optics.etat_bas}, Haut=${optics.etat_haut}, Centre=${optics.etat_centre}`,
      criticite: optics.etat_bas === 'Défaut' || optics.etat_haut === 'Défaut' ? 'MAJEURE' : 'MINEURE',
      num_serie: `F${1000 + optics.id_feu}`
    })));

    return transformedAlerts;
  }
}
