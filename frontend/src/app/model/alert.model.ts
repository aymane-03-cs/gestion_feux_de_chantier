export enum AlertType {
    BATTERIE = 'BATTERIE',
    OPTIQUE = 'OPTIQUE',
    POSITION = 'POSITION',
    FONCTIONNEMENT = 'FONCTIONNEMENT'
  }
  
  
  
  export interface Alert {
    id_alerte: number;
    id_feu: number;
    type_alerte: 'BATTERIE' | 'OPTIQUE' | 'POSITION' | 'FONCTIONNEMENT';
    date_alerte: string;
    date_resolution?: string;
    description: string;
    criticite: 'CRITIQUE' | 'MAJEURE' | 'MINEURE';
    num_serie: string;
  }
  
  export type CreateAlert = Omit<Alert, 'id_alerte'|'date_resolution'>;
  export type UpdateAlert = Partial<Pick<Alert, 'date_resolution'|'criticite'>>;
  export type Criticite = 'CRITIQUE' | 'MAJEURE' | 'MINEURE';
  
//   // Interface pour la création d'alerte
//   export interface CreateAlert {
//     id_feu: number;
//     type_alerte: AlertType;
//     description: string;
//     criticite: Criticite;
//   }
  
//   // Interface pour la mise à jour d'alerte
//   export interface UpdateAlert {
//     date_resolution?: string;
//     criticite?: Criticite;
//   }
  
  // Réponse standard des API Alertes
  export interface AlertResponse {
    success: boolean;
    message?: string;
    alert?: Alert;
    error?: string;
  }