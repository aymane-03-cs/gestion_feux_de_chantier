import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  Feu, 
  EtatBatterie, 
  EtatOptiques, 
  ModeFonctionnement, 
  TypeCycle,
  PositionGeographique,
  Fonctionnement,
  Cycle,
  EtatOptique,
  EtatBatterieRecord
} from '../model/feu.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getFeux(): Observable<Feu[]> {
    // Positions géographiques
    const mockPositions: PositionGeographique[] = [
      {
        id_position: 1,
        id_feu: 1,
        latitude: 48.85,
        longitude: 2.35,
        date_enregistrement: new Date('2025-02-21T14:00:00Z'),
        position_physique: 180
      },
      {
        id_position: 2,
        id_feu: 2,
        latitude: 48.86,
        longitude: 2.36,
        date_enregistrement: new Date('2025-02-21T14:30:00Z'),
        position_physique: 180
      }
    ];

    // États de batterie
    const mockEtatsBatterie: EtatBatterieRecord[] = [
      {
        id_etat_batterie: 1,
        id_feu: 1,
        type_etat_batterie: EtatBatterie.PLEIN,
        autonomie_restante: "100H",
        date_enregistrement_batterie: new Date('2025-02-21T14:00:00Z')
      },
      {
        id_etat_batterie: 2,
        id_feu: 2,
        type_etat_batterie: EtatBatterie.VIDE,
        autonomie_restante: "000H",
        date_enregistrement_batterie: new Date('2025-02-21T14:30:00Z')
      }
    ];

    // États d'optiques
    const mockEtatsOptiques: EtatOptique[] = [
      {
        id_etat_optique: 1,
        id_feu: 1,
        etat_bas: EtatOptiques.OPERATIONNELLE,
        etat_haut: EtatOptiques.OPERATIONNELLE,
        etat_centre: EtatOptiques.OPERATIONNELLE,
        etat_affichage_7_segments: "OK",
        date_enregistrement_optiques: new Date('2025-02-21T14:00:00Z')
      },
      {
        id_etat_optique: 2,
        id_feu: 2,
        etat_bas: EtatOptiques.DEFECTUEUX,
        etat_haut: EtatOptiques.DEFAUT,
        etat_centre: EtatOptiques.DEFECTUEUX,
        etat_affichage_7_segments: "ERR",
        date_enregistrement_optiques: new Date('2025-02-21T14:30:00Z')
      }
    ];

    // Modes de fonctionnement
    const mockFonctionnements: Fonctionnement[] = [
      {
        id_fonctionnement: 1,
        id_feu: 1,
        mode_fonctionnement: ModeFonctionnement.AUTO,
        date_enregistrement_fonctionnement: new Date('2025-02-21T14:00:00Z')
      },
      {
        id_fonctionnement: 2,
        id_feu: 2,
        mode_fonctionnement: ModeFonctionnement.CLIGNOTANT,
        date_enregistrement_fonctionnement: new Date('2025-02-21T14:30:00Z')
      }
    ];

    // Cycles
    const mockCycles: Cycle[] = [
      {
        id_cycle: 1,
        id_feu: 1,
        mode_cycle: TypeCycle.FIXE,
        date_enregistrement_cycle: new Date('2025-02-21T14:00:00Z')
      },
      {
        id_cycle: 2,
        id_feu: 2,
        mode_cycle: TypeCycle.CLIGNOTANT,
        date_enregistrement_cycle: new Date('2025-02-21T14:30:00Z')
      }
    ];

    return of([
      {
        id_feu: 1,
        num_serie: 'F1234',
        pays_utilisation: 'France',
        tension_service: '12V',
        tension_alimentation: '220V',
        date_derniere_maj: new Date('2025-02-21T14:00:00Z'),
        etats_batteries: [mockEtatsBatterie[0]],
        etats_optiques: [mockEtatsOptiques[0]],
        fonctionnements: [mockFonctionnements[0]],
        cycles: [mockCycles[0]],
        positions: [mockPositions[0]]
      },
      {
        id_feu: 2,
        num_serie: 'F5678',
        pays_utilisation: 'France',
        tension_service: '12V',
        tension_alimentation: '220V',
        date_derniere_maj: new Date('2025-02-21T14:30:00Z'),
        etats_batteries: [mockEtatsBatterie[1]],
        etats_optiques: [mockEtatsOptiques[1]],
        fonctionnements: [mockFonctionnements[1]],
        cycles: [mockCycles[1]],
        positions: [mockPositions[1]]
      }
    ]);
  }
}