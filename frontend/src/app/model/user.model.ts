
//User Interface To respect 
export interface User {
    id_utilisateur: number;
    nom: string;
    email_utilisateur: string;
    tel_utilisateur: string;
    role : UserRoles;
}


// Some aspects to consider when defining authorization service 
export interface Use {
    id_utilisation: number;
    id_groupe: number;
    id_utilisateur: number;
    id_chantier: number;

}



export enum UserRoles {
    ADMIN = "ADMIN",
    USER = "USER",
    VISITOR = "VISITOR"
  }  