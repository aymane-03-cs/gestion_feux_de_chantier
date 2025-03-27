import { Injectable } from '@angular/core';
import { Observable, of , throwError} from 'rxjs';
import { EtatBatterie, EtatOptiques, Feu } from '../model/feu.model';

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
export class MockAlertService {
  private alerts: Alert[] = [];
  private lastId = 0;

  constructor() {
    this.generateMockAlerts();
  }

  private generateMockAlerts(): void {
    // Génération d'alertes réalistes
    this.createAlert(1, 'BATTERIE', 'Vide', 'CRITIQUE');
    this.createAlert(2, 'OPTIQUE', 'Defectueux', 'MAJEURE');
    this.createAlert(3, 'POSITION', 'Position inhabituelle', 'MINEURE');
    this.createAlert(1, 'FONCTIONNEMENT', 'Mode alerte activé', 'CRITIQUE');
  }

  private createAlert(
    feuId: number,
    type: AlertType,
    description: string,
    criticite: Criticite
  ): void {
    this.alerts.push({
      id_alerte: ++this.lastId,
      id_feu: feuId,
      type_alerte: type,
      date_alerte: new Date().toISOString(),
      description: description,
      criticite: criticite,
      num_serie: `F${1000 + feuId}`
    });
  }

  getAlerts(): Observable<Alert[]> {
    return of(this.alerts);
  }

  

  generateAlertsFromFeux(feux: Feu[]): void {
    feux.forEach(feu => {
      // Alertes batterie
      if (feu.etats_batteries && feu.etats_batteries.length > 0) {
        const batterie = feu.etats_batteries[feu.etats_batteries.length - 1] as unknown as EtatBatterie; // Ensure correct type
        if (batterie === EtatBatterie.VIDE) {
          this.createAlert(feu.id_feu, 'BATTERIE', 'Batterie vide', 'CRITIQUE');
        } else if (batterie === EtatBatterie.VINGT_CINQ) {
          this.createAlert(feu.id_feu, 'BATTERIE', 'Batterie faible (25%)', 'MAJEURE');
        }
      }
  
      // Alertes optiques
      if (feu.etats_optiques && feu.etats_optiques.length > 0) {
        const optique = feu.etats_optiques[feu.etats_optiques.length - 1] as unknown as EtatOptiques; // Ensure correct type
        if (optique === EtatOptiques.DEFECTUEUX) {
          this.createAlert(feu.id_feu, 'OPTIQUE', 'Optique défectueuse', 'MAJEURE');
        }
      }
  
      // Alertes position (exemple)
      if (feu.positions && feu.positions.length > 0) {
        const position = feu.positions[feu.positions.length - 1];
        if (position.position_physique !== 180 ) {
          this.createAlert(feu.id_feu, 'POSITION', `Position ${position.position_physique}`, 'MINEURE');
        }
      }
    });
  }

  
  resolveAlert(id: number): Observable<Alert> {
    const index = this.alerts.findIndex(a => a.id_alerte === id);
    
    if (index === -1) {
      return throwError(() => new Error('Alerte non trouvée'));
    }
  
    const updatedAlert = {
      ...this.alerts[index],
      date_resolution: new Date().toISOString()
    };

    this.alerts[index] = updatedAlert;
    return of(updatedAlert);
  }
}