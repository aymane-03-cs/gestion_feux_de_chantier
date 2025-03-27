import { Injectable } from '@angular/core';
import { Feu, EtatBatterie, EtatOptiques, ModeFonctionnement, EtatBatterieRecord } from '../model/feu.model';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  /** Renvoie le dernier élément d'un tableau s'il existe */
  private getLatest<T>(arr?: T[]): T | undefined {
    return arr && arr.length > 0 ? arr[arr.length - 1] : undefined;
  }

  computeMetrics(feux: Feu[]) {
    const totalFeux = feux.length;

    const totalAlertes = feux.filter(feu => {
      const optique = this.getLatest(feu.etats_optiques);
      const batterie = this.getLatest(feu.etats_batteries);
      return (
        batterie?.type_etat_batterie &&
        [EtatBatterie.VIDE, EtatBatterie.VINGT_CINQ].includes(batterie.type_etat_batterie)
        );
      });


    const totalDefauts = feux.filter(feu => {
      const batterie = this.getLatest(feu.etats_batteries);
      return batterie?.type_etat_batterie === EtatBatterie.VIDE;
    }).length;

    const totalInterventions = Math.ceil(
      feux.filter(feu => {
        const optique = this.getLatest(feu.etats_optiques);
        const batterie = this.getLatest(feu.etats_batteries);
        const fonctionnement = this.getLatest(feu.fonctionnements);
        return optique?.etat_bas === EtatOptiques.DEFECTUEUX ||
               batterie?.type_etat_batterie === EtatBatterie.VIDE ||
               fonctionnement?.mode_fonctionnement === ModeFonctionnement.ROUGE;
      }).length * 1.3
    );

    const batteryStats: Record<string, number> = {
      [EtatBatterie.PLEIN]: 0,
      [EtatBatterie.SOIXANTE_QUINZE]: 0,
      [EtatBatterie.CINQUANTE]: 0,
      [EtatBatterie.VINGT_CINQ]: 0,
      [EtatBatterie.VIDE]: 0,
    };

    feux.forEach(feu => {
      const batterie = this.getLatest(feu.etats_batteries);
      if (batterie?.type_etat_batterie) {
        batteryStats[batterie.type_etat_batterie] = (batteryStats[batterie.type_etat_batterie] || 0) + 1;
      }
    });

    const functionStats: Record<string, number> = {};
    feux.forEach(feu => {
      const fonctionnement = this.getLatest(feu.fonctionnements);
      if (fonctionnement?.mode_fonctionnement) {
        functionStats[fonctionnement.mode_fonctionnement] = (functionStats[fonctionnement.mode_fonctionnement] || 0) + 1;
      }
    });

    return {
      totalFeux,
      totalAlertes,
      totalDefauts,
      totalInterventions,
      batteryStats,
      functionStats
    };
  }
}
