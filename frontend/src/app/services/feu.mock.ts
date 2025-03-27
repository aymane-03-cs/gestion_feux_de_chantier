import { Feu, EtatBatterie, EtatOptiques, ModeFonctionnement, TypeCycle, PositionGeographique, Cycle, EtatOptique, EtatBatterieRecord, Fonctionnement } from '../model/feu.model';

export const FEUX_MOCK: Feu[] = [
  {
    id_feu: 1,
    num_serie: 'F1001',
    pays_utilisation: 'France',
    tension_service: '12V',
    tension_alimentation: '24V',
    date_derniere_maj: new Date(),

    positions: [
      {
        id_position: 1,
        id_feu: 1,
        latitude: 48.8566,
        longitude: 2.3522,
        date_enregistrement: new Date(),
        position_physique: 1
      }
    ],

    fonctionnements: [
      {
        id_fonctionnement: 1,
        id_feu: 1,
        mode_fonctionnement: ModeFonctionnement.AUTO,
        date_enregistrement_fonctionnement: new Date()
      }
    ],

    cycles: [
      {
        id_cycle: 1,
        id_feu: 1,
        mode_cycle: TypeCycle.FIXE,
        date_enregistrement_cycle: new Date()
      }
    ],

    etats_optiques: [
      {
        id_etat_optique: 1,
        id_feu: 1,
        etat_bas: EtatOptiques.OPERATIONNELLE,
        etat_haut: EtatOptiques.DEFAUT,
        etat_centre: EtatOptiques.DEFECTUEUX,
        etat_affichage_7_segments: 'OK',
        date_enregistrement_optiques: new Date()
      }
    ],

    etats_batteries: [
      {
        id_etat_batterie: 1,
        id_feu: 1,
        type_etat_batterie: EtatBatterie.CINQUANTE,
        autonomie_restante: '050H',
        date_enregistrement_batterie: new Date()
      }
    ]
  },
  {
    id_feu: 2,
    num_serie: 'F1002',
    pays_utilisation: 'Belgique',
    tension_service: '24V',
    tension_alimentation: '48V',
    date_derniere_maj: new Date(),

    positions: [
      {
        id_position: 2,
        id_feu: 2,
        latitude: 50.8503,
        longitude: 4.3517,
        date_enregistrement: new Date(),
        position_physique: 2
      }
    ],

    fonctionnements: [
      {
        id_fonctionnement: 2,
        id_feu: 2,
        mode_fonctionnement: ModeFonctionnement.CLIGNOTANT,
        date_enregistrement_fonctionnement: new Date()
      }
    ],

    cycles: [
      {
        id_cycle: 2,
        id_feu: 2,
        mode_cycle: TypeCycle.CLIGNOTANT,
        date_enregistrement_cycle: new Date()
      }
    ],

    etats_optiques: [
      {
        id_etat_optique: 2,
        id_feu: 2,
        etat_bas: EtatOptiques.DEFECTUEUX,
        etat_haut: EtatOptiques.OPERATIONNELLE,
        etat_centre: EtatOptiques.OPERATIONNELLE,
        etat_affichage_7_segments: 'ERR',
        date_enregistrement_optiques: new Date()
      }
    ],

    etats_batteries: [
      {
        id_etat_batterie: 2,
        id_feu: 2,
        type_etat_batterie: EtatBatterie.VIDE,
        autonomie_restante: '000H',
        date_enregistrement_batterie: new Date()
      }
    ]
  }
];

