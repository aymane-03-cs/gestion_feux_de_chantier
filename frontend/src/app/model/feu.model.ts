/***************************************************
 *  Énumérations (correspondent aux enums SQL)
 ***************************************************/

export enum EtatBatterie {
  PLEIN = 'Plein',
  SOIXANTE_QUINZE = '75%',
  CINQUANTE = '50%',
  VINGT_CINQ = '25%',
  VIDE = 'Vide'
}

export enum EtatOptiques {
  OPERATIONNELLE = 'Opérationnelle',
  DEFAUT = 'Défaut',
  DEFECTUEUX = 'Défectueux'
}

export enum ModeFonctionnement {
  AUTO = 'Auto',
  CLIGNOTANT = 'Clignotant',
  ROUGE = 'Rouge',
  VEILLE = 'Veille'
}

export enum TypeCycle {
  CLIGNOTANT = 'Clignotant',
  FIXE = 'Fixe'
}



/***************************************************
 *  Interfaces de chaque table
 ***************************************************/

/**
 * Correspond à la table "position_geographique"
 * - id_position      (PK)
 * - id_feu           (FK vers feu)
 * - latitude
 * - longitude
 * - date_enregistrement
 * - position_physique (enum PositionPhysique)
 */
export interface PositionGeographique {
  id_position: number;
  id_feu: number;
  latitude: number;
  longitude: number;
  date_enregistrement: Date;
  position_physique: number;
}

/**
 * Correspond à la table "fonctionnement"
 * - id_fonctionnement (PK)
 * - id_feu            (FK vers feu)
 * - mode_fonctionnement (enum ModeFonctionnement)
 * - date_enregistrement_fonctionnement
 */
export interface Fonctionnement {
  id_fonctionnement: number;
  id_feu: number;
  mode_fonctionnement: ModeFonctionnement;
  date_enregistrement_fonctionnement: Date;
}

/**
 * Correspond à la table "cycle"
 * - id_cycle           (PK)
 * - id_feu             (FK vers feu)
 * - mode_cycle         (enum TypeCycle)
 * - date_enregistrement_cycle
 */
export interface Cycle {
  id_cycle: number;
  id_feu: number;
  mode_cycle: TypeCycle;
  date_enregistrement_cycle: Date;
}

/**
 * Correspond à la table "etat_optiques"
 * - id_etat_optique           (PK)
 * - id_feu                    (FK vers feu)
 * - etat_bas, etat_haut, etat_centre (enum EtatOptiques)
 * - etat_affichage_7_segments (varchar)
 * - date_enregistrement_optiques
 */
export interface EtatOptique {
  id_etat_optique: number;
  id_feu: number;
  etat_bas: EtatOptiques;
  etat_haut: EtatOptiques;
  etat_centre: EtatOptiques;
  etat_affichage_7_segments: string;
  date_enregistrement_optiques: Date;
}

/**
 * Correspond à la table "etat_batterie"
 * - id_etat_batterie          (PK)
 * - id_feu                    (FK vers feu)
 * - type_etat_batterie        (enum EtatBatterie)
 * - autonomie_restante        (char(4), ex: "075H")
 * - date_enregistrement_batterie
 */
export interface EtatBatterieRecord {
  id_etat_batterie: number;
  id_feu: number;
  type_etat_batterie: EtatBatterie;
  autonomie_restante: string;   // ex: "100H", "050H", etc.
  date_enregistrement_batterie: Date;
}

/***************************************************
 *  Interface principale pour un Feu
 ***************************************************/

/**
 * Correspond à la table "feu"
 * - id_feu               (PK)
 * - num_serie
 * - pays_utilisation
 * - tension_service
 * - tension_alimentation
 * - date_derniere_maj
 * - id_loueur?           (FK vers loueur)
 * - id_groupe?           (FK vers groupe)
 * 
 * + relations (sous forme d'arrays) vers :
 *   - positions géographiques (PositionGeographique[])
 *   - fonctionnements (Fonctionnement[])
 *   - cycles (Cycle[])
 *   - états d'optiques (EtatOptique[])
 *   - états de batterie (EtatBatterieRecord[])
 */
export interface Feu {
  id_feu: number;
  num_serie: string;
  pays_utilisation: string;
  tension_service: string;
  tension_alimentation: string;
  date_derniere_maj: Date;

  // Clés étrangères facultatives
  id_loueur?: number;
  id_groupe?: number;

  positions?: PositionGeographique[];
  fonctionnements?: Fonctionnement[];
  cycles?: Cycle[];
  etats_optiques?: EtatOptique[];
  etats_batteries?: EtatBatterieRecord[]  ;
}


