/**
 * 🚦 FireManagementComponent - Traffic Light (Feu) Management UI
 * --------------------------------------------------------------
 * This component manages the visualization, addition, modification, 
 * and deletion of traffic lights (Feux) using an interactive map (Leaflet).
 *
 * 🔹 Features:
 * - Displays traffic lights on a Leaflet map.
 * - Allows Admins to create, update, and delete feux.
 * - Fetches feux from `FeuService` based on user role.
 * - Handles modal-based CRUD operations.
 * - Uses Bootstrap for UI interactions.
 * 
 * 🔒 Role-Based Access:
 * - Admin (1) → Full access (Create, Update, Delete, View).
 * - Company User (2) → Limited access (View & Update assigned feux).
 * - Visitor (3) → Read-only access.
 * 
 * 🛠 Technologies:
 * - Angular Standalone Component.
 * - Leaflet for interactive maps.
 * - Bootstrap for modals & UI.
 * - FeuService for API communication.
 */

import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Feu, EtatOptiques, EtatBatterie, ModeFonctionnement } from '../../model/feu.model';
import { FeuService } from '../../services/feu.service';
//import { FeuService } from '../../services/mock-feu.service';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any;
declare var L: any;

enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
  VISITOR = "VISITOR"
}

@Component({
  selector: 'app-fire-management',
  templateUrl: './fire-management.component.html',
  styleUrls: ['./fire-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FireManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  feux: Feu[] = [];
  map: any;
  markers: any[] = [];
  leafletInitialized = false;
  messageSucces: string = "";
  messageErreur: string = "";
  isBrowser: boolean;
  userRole: string | null = '';

  // New feu creation
  newFeu: Feu = this.getDefaultFeu();
  feuEnModification: Feu | null = null;
  ajoutModal: any;
  modifModal: any;


  // Interface 
  EtatOptiques = EtatOptiques;
  EtatBatterie = EtatBatterie;
  ModeFonctionnement = ModeFonctionnement;


  constructor(
    private feuService: FeuService,  
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit(): void {
    this.loadFeux();
    this.initModals();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;
    await this.initializeLeaflet();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }


  /* ==========================================================
    *     UTILITY FUNCTIONS
    * ========================================================== */

  getLatest<T>(arr: T[] | undefined): T | undefined {
    return arr && arr.length > 0 ? arr[arr.length - 1] : undefined;  
  }

  fermerAlerte(): void {
    this.messageSucces = "";
    this.messageErreur = "";
  }


  /* ==========================================================
   *     ROLE-BASED RESTRICTIONS
   * ========================================================== */
  getUserRole(): string | null {
    return this.authService.getUserRole();
  }
  
  isAdmin(): boolean {
    return this.getUserRole() === UserRoles.ADMIN;
  }
  
  isUser(): boolean {
    return this.getUserRole() === UserRoles.USER;
  }
  
  isVisitor(): boolean {
    return this.getUserRole() === UserRoles.VISITOR;
  }

  /* ==========================================================
   *     MODAL INITIALIZATION
   * ========================================================== */

  private initModals(): void {
    if (this.isBrowser) {
      const modalAjoutEl = document.getElementById('ajoutFeuModal');
      const modalModifEl = document.getElementById('modifFeuModal');

      if (modalAjoutEl) {
        this.ajoutModal = new bootstrap.Modal(modalAjoutEl, {
          backdrop: 'static',
          keyboard: false
        });
      }

      if (modalModifEl) {
        this.modifModal = new bootstrap.Modal(modalModifEl, {
          backdrop: 'static',
          keyboard: false
        });
      }
    }
  }

  /* ==========================================================
    *     MODAL OPERATIONS
    * ========================================================== */

  // ouvrirModalModification(feu: Feu): void {
  //   this.feuEnModification = { ...feu };
  // }

  // fermerModal(type: string): void {
  //   if (type === 'ajout' && this.ajoutModal) {
  //     this.ajoutModal.hide(); // Forcer la fermeture de la modal ajout
  //     this.newFeu = this.getDefaultFeu();
  //   } else if (type === 'modif' && this.modifModal) {
  //     this.modifModal.hide(); // Forcer la fermeture de la modal modification
  //     this.feuEnModification = null;
  //   }
  // }
  private closeBootstrapModal(modal: any): void {
    if (modal) {
      modal.hide(); // Fermer la modal avec Bootstrap
      document.body.classList.remove('modal-open'); // Enlever la classe qui bloque le scroll
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove(); // Supprimer le fond sombre Bootstrap
    }
  }
  
  ouvrirModalModification(feu: Feu): void {
    this.feuEnModification = { ...feu };
    if (this.modifModal) {
      this.modifModal.show(); // Ouvre la modal si elle est bien initialisée
    }
  }

  fermerModal(type: string): void {
    if (type === 'ajout') {
      this.closeBootstrapModal(this.ajoutModal);
      this.newFeu = this.getDefaultFeu(); // Réinitialise les données
    } else if (type === 'modif') {
      this.closeBootstrapModal(this.modifModal);
      this.feuEnModification = null; // Réinitialise
    }
  }
  

  /* ==========================================================
   *     LOAD & DISPLAY FEUX
   * ========================================================== */

  private loadFeux(): void {
    this.feuService.getAllFeux().subscribe(data => {
      this.feux = data;
      if (this.leafletInitialized) {
        this.ajouterMarqueurs();
      }
    });
  }

  /* ==========================================================
   *     LEAFLET MAP SETUP
   * ========================================================== */

  private async initializeLeaflet(): Promise<void> {
    try {
      const { default: leaflet } = await import('leaflet');
      L = leaflet;
      this.setupMap();
      this.leafletInitialized = true;
      this.ajouterMarqueurs();
    } catch (error) {
      console.error('Erreur de chargement de Leaflet:', error);
    }
  }

  private setupMap(): void {
    this.map = L.map('map').setView([44.84, -0.57], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  // private ajouterMarqueurs(): void {
  //   if (!this.leafletInitialized || !this.map) return;

  //   this.markers.forEach(marker => marker.remove());
  //   this.markers = [];

  //   this.feux.forEach(feu => {
  //     const latestPos = feu.positions?.[0];
  //     if (latestPos) {
  //       const marker = L.marker([latestPos.latitude, latestPos.longitude])
  //         .addTo(this.map)
  //         .bindPopup(`Feu: ${feu.num_serie}`);
  //       this.markers.push(marker);
  //     }
  //   });
  // }
  private ajouterMarqueurs(): void {
    if (!this.leafletInitialized || !this.map) return;
  
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  
    const chantierIcon = L.icon({
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Feu_tricolore.png/50px-Feu_tricolore.png',
      iconSize: [30, 40], // Taille de l'icône
      iconAnchor: [15, 40], // Point d'ancrage de l'icône
      popupAnchor: [0, -35], // Position du popup
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });
    
  
    this.feux.forEach(feu => {
      console.log(`Vérification du feu ${feu.num_serie}`, feu.positions);
  
      const latestPos = feu.positions?.[0]; // Récupère la dernière position connue
      if (latestPos && latestPos.latitude && latestPos.longitude) {
        const marker = L.marker([latestPos.latitude, latestPos.longitude], { icon: chantierIcon })
          .addTo(this.map)
          .bindPopup(`Feu: ${feu.num_serie}`);
        this.markers.push(marker);
      } else {
        console.warn(`Aucune position valide pour le feu ${feu.num_serie}`);
      }
    });
  }
  
  

  /* ==========================================================
   *     CRUD OPERATIONS WITH ROLE RESTRICTIONS
   * ========================================================== */

  // ajouterFeu(): void {
  //   if (!this.isAdmin()) {
  //     this.messageErreur = "Accès refusé : Seuls les admins peuvent ajouter des feux.";
  //     return;
  //   }

  //   this.feuService.createFeu(this.newFeu).subscribe(feu => {
  //     this.feux.push(feu);
  //     this.messageSucces = "Feu ajouté avec succès.";
  //     this.newFeu = this.getDefaultFeu();
  //     this.ajouterMarqueurs();
  //   });
  // }
  ajouterFeu(): void {
    if (!this.isAdmin()) {
      this.messageErreur = "Accès refusé : Seuls les admins peuvent ajouter des feux.";
      return;
    }
  
    this.feuService.createFeu(this.newFeu).subscribe(response => {
      if (response && response.feuId) {
        // Simuler l'ajout du nouveau feu dans la liste locale avec l'ID retourné par l'API
        const nouveauFeu: Feu = {
          ...this.newFeu, // Copier les données saisies
          id_feu: response.feuId, // Utiliser l'ID retourné par le backend
          id_groupe: this.newFeu.id_groupe || 1, // Assurer la présence de l'ID de groupe
          positions: this.newFeu.positions || [], // Assurer la présence de positions
          etats_optiques: this.newFeu.etats_optiques || [],
          etats_batteries: this.newFeu.etats_batteries || [],
          fonctionnements: this.newFeu.fonctionnements || [],
          cycles: this.newFeu.cycles || []
        };
  
        this.feux.push(nouveauFeu);
        this.messageSucces = response.message; // Utiliser le message retourné par l'API
        this.fermerModal('ajout'); // ✅ Fermer la modal après succès
        this.newFeu = this.getDefaultFeu(); // Réinitialiser le formulaire
      } else {
        this.messageErreur = "Erreur : le feu n'a pas été ajouté.";
      }
    }, error => {
      this.messageErreur = "Erreur lors de l'ajout du feu : " + error.message;
    });
  }
  
  // modifierFeu(): void {
  //   if (!this.isAdmin() && !this.isUser()) {
  //     this.messageErreur = "Accès refusé : Seuls les admins et utilisateurs (Company) peuvent modifier des feux.";
  //     return;
  //   }
  
  //   if (!this.feuEnModification) {
  //     this.messageErreur = "Aucun feu sélectionné.";
  //     return;
  //   }
  
  //   const feuToUpdate: Feu = { ...this.feuEnModification };
  
  //   this.feuService.updateFeu(feuToUpdate.id_feu, feuToUpdate).subscribe(feu => {
  //     if (feu) {
  //       const index = this.feux.findIndex(f => f.id_feu === feu.id_feu);
  //       if (index !== -1) this.feux[index] = feu;
  
  //       this.messageSucces = "Feu modifié avec succès.";
  //       this.fermerModal('modif'); // ✅ Fermer la modal après modification
  //     }
  //   });
  // }
  // modifierFeu(): void {
  //   if (!this.isAdmin() && !this.isUser()) {
  //     this.messageErreur = "Accès refusé : Seuls les admins et utilisateurs (Company) peuvent modifier des feux.";
  //     return;
  //   }
  
  //   if (!this.feuEnModification) {
  //     this.messageErreur = "Aucun feu sélectionné.";
  //     return;
  //   }
  
  //   // ✅ Construction de l'objet `feuToUpdate` en respectant la structure correcte
  //   const feuToUpdate: Feu = {
  //     id_feu: this.feuEnModification.id_feu,
  //     num_serie: this.feuEnModification.num_serie,
  //     pays_utilisation: this.feuEnModification.pays_utilisation,
  //     tension_service: this.feuEnModification.tension_service,
  //     tension_alimentation: this.feuEnModification.tension_alimentation,
  //     date_derniere_maj: new Date(),
  
  //     // ✅ Mise à jour des sous-objets
  //     positions: [{
  //       id_position: this.feuEnModification.positions?.[0]?.id_position || 0,
  //       id_feu: this.feuEnModification.id_feu,
  //       position_physique: Number(this.feuEnModification.positions?.[0]?.position_physique) || 0, // Assurer que c'est un `number`
  //       latitude: Number(this.feuEnModification.positions?.[0]?.latitude) || 0,
  //       longitude: Number(this.feuEnModification.positions?.[0]?.longitude) || 0,
  //       date_enregistrement: new Date()
  //     }],
  
  //     fonctionnements: [{
  //       id_fonctionnement: this.feuEnModification.fonctionnements?.[0]?.id_fonctionnement || 0,
  //       id_feu: this.feuEnModification.id_feu,
  //       mode_fonctionnement: this.feuEnModification.fonctionnements?.[0]?.mode_fonctionnement || ModeFonctionnement.AUTO,
  //       date_enregistrement_fonctionnement: new Date()
  //     }],
  
  //     etats_optiques: [{
  //       id_etat_optique: this.feuEnModification.etats_optiques?.[0]?.id_etat_optique || 0,
  //       id_feu: this.feuEnModification.id_feu,
  //       etat_bas: this.feuEnModification.etats_optiques?.[0]?.etat_bas || EtatOptiques.OPERATIONNELLE,
  //       etat_haut: this.feuEnModification.etats_optiques?.[0]?.etat_haut || EtatOptiques.OPERATIONNELLE,
  //       etat_centre: this.feuEnModification.etats_optiques?.[0]?.etat_centre || EtatOptiques.OPERATIONNELLE,
  //       etat_affichage_7_segments: this.feuEnModification.etats_optiques?.[0]?.etat_affichage_7_segments || '',
  //       date_enregistrement_optiques: new Date()
  //     }],
  
  //     etats_batteries: [{
  //       id_etat_batterie: this.feuEnModification.etats_batteries?.[0]?.id_etat_batterie || 0,
  //       id_feu: this.feuEnModification.id_feu,
  //       type_etat_batterie: this.feuEnModification.etats_batteries?.[0]?.type_etat_batterie || EtatBatterie.PLEIN,
  //       autonomie_restante: this.feuEnModification.etats_batteries?.[0]?.autonomie_restante || '100H',
  //       date_enregistrement_batterie: new Date()
  //     }],
  
  //     cycles: this.feuEnModification.cycles || []
  //   };
  
  //   // ✅ Envoi de la requête de mise à jour
  //   this.feuService.updateFeu(feuToUpdate.id_feu, feuToUpdate).subscribe(response => {
  //     if (response) {
  //       const index = this.feux.findIndex(f => f.id_feu === response.id_feu);
  //       if (index !== -1) {
  //         this.feux[index] = { ...feuToUpdate };
  //       }
  
  //       this.messageSucces = "Feu modifié avec succès.";
  //       this.fermerModal('modif'); // ✅ Fermer la modal après modification
  //     } else {
  //       this.messageErreur = "Erreur lors de la mise à jour du feu.";
  //     }
  //   }, error => {
  //     this.messageErreur = "Erreur lors de la mise à jour du feu : " + error.message;
  //   });
  // }

  modifierFeu(): void {
    // Role check
    if (!this.isAdmin() && !this.isUser()) {
      this.messageErreur = "Accès refusé : Seuls les admins et utilisateurs (Company) peuvent modifier des feux.";
      return;
    }
  
    // Check if a feu is selected
    if (!this.feuEnModification) {
      this.messageErreur = "Aucun feu sélectionné.";
      return;
    }
  
    // Check if the required fields are filled
    if (!this.feuEnModification.num_serie || this.feuEnModification.num_serie.trim() === '') {
      this.messageErreur = "Erreur : Le numéro de série est requis.";
      return;
    }
  
    // Prepare the updated feu object
    const feuToUpdate: Feu = {
      id_feu: this.feuEnModification.id_feu,
      num_serie: this.feuEnModification.num_serie.trim(), 
      id_groupe: this.feuEnModification.id_groupe || 1, 
      pays_utilisation: this.feuEnModification.pays_utilisation || 'FR',
      tension_service: this.feuEnModification.tension_service || '12V',
      tension_alimentation: this.feuEnModification.tension_alimentation || '220V',
      date_derniere_maj: new Date(),
  
      positions: [{
        id_position: this.feuEnModification.positions?.[0]?.id_position || 0,
        id_feu: this.feuEnModification.id_feu,
        position_physique: Number(this.feuEnModification.positions?.[0]?.position_physique) || 0,
        latitude: Number(this.feuEnModification.positions?.[0]?.latitude) || 0,
        longitude: Number(this.feuEnModification.positions?.[0]?.longitude) || 0,
        date_enregistrement: new Date()
      }],
  
      fonctionnements: [{
        id_fonctionnement: this.feuEnModification.fonctionnements?.[0]?.id_fonctionnement || 0,
        id_feu: this.feuEnModification.id_feu,
        mode_fonctionnement: this.feuEnModification.fonctionnements?.[0]?.mode_fonctionnement || ModeFonctionnement.AUTO,
        date_enregistrement_fonctionnement: new Date()
      }],
  
      etats_optiques: [{
        id_etat_optique: this.feuEnModification.etats_optiques?.[0]?.id_etat_optique || 0,
        id_feu: this.feuEnModification.id_feu,
        etat_bas: this.feuEnModification.etats_optiques?.[0]?.etat_bas || EtatOptiques.OPERATIONNELLE,
        etat_haut: this.feuEnModification.etats_optiques?.[0]?.etat_haut || EtatOptiques.OPERATIONNELLE,
        etat_centre: this.feuEnModification.etats_optiques?.[0]?.etat_centre || EtatOptiques.OPERATIONNELLE,
        etat_affichage_7_segments: this.feuEnModification.etats_optiques?.[0]?.etat_affichage_7_segments || '',
        date_enregistrement_optiques: new Date()
      }],
  
      etats_batteries: [{
        id_etat_batterie: this.feuEnModification.etats_batteries?.[0]?.id_etat_batterie || 0,
        id_feu: this.feuEnModification.id_feu,
        type_etat_batterie: this.feuEnModification.etats_batteries?.[0]?.type_etat_batterie || EtatBatterie.PLEIN,
        autonomie_restante: this.feuEnModification.etats_batteries?.[0]?.autonomie_restante || '100H',
        date_enregistrement_batterie: new Date()
      }],
  
      cycles: this.feuEnModification.cycles || []
    };
  
  
    // Send the update request to the API
    this.feuService.updateFeu(feuToUpdate.id_feu, feuToUpdate).subscribe(response => {
      if (response) {
        const index = this.feux.findIndex(f => f.id_feu === response.id_feu);
        if (index !== -1) {
          this.feux[index] = { ...feuToUpdate };
        }
  
        this.messageSucces = "Feu modifié avec succès.";
        this.fermerModal('modif'); 
      } else {
        this.messageErreur = "Erreur lors de la mise à jour du feu.";
      }
    }, error => {
      this.messageErreur = "Erreur lors de la mise à jour du feu : " + error.message;
    });
  }
  
  
  

  supprimerFeu(id: number): void {
    if (!this.isAdmin()) {
      this.messageErreur = "Accès refusé : Seuls les admins peuvent supprimer des feux.";
      return;
    }

    this.feuService.deleteFeu(id).subscribe(() => {
      this.feux = this.feux.filter(f => f.id_feu !== id);
      this.messageSucces = "Feu supprimé avec succès.";
    });
  }

  /* ==========================================================
   *     UTILITIES
   * ========================================================== */

  private getDefaultFeu(): Feu {
    return {
      id_feu: 0,
      num_serie: '',
      pays_utilisation: 'France',
      tension_service: '230V',
      tension_alimentation: '230V',
      date_derniere_maj: new Date(),
  
      // Positions : un objet par défaut
      positions: [{
        id_position: 0,
        id_feu: 0,
        latitude: 44.84,
        longitude: -0.57,
        date_enregistrement: new Date(),
        position_physique: 1
      }],
  
      // Un état optique par défaut
      etats_optiques: [{
        id_etat_optique: 0,
        id_feu: 0,
        etat_bas: EtatOptiques.OPERATIONNELLE,
        etat_haut: EtatOptiques.OPERATIONNELLE,
        etat_centre: EtatOptiques.OPERATIONNELLE,
        etat_affichage_7_segments: '',
        date_enregistrement_optiques: new Date()
      }],
  
      // Un état batterie par défaut
      etats_batteries: [{
        id_etat_batterie: 0,
        id_feu: 0,
        type_etat_batterie: EtatBatterie.PLEIN,
        autonomie_restante: '100H',
        date_enregistrement_batterie: new Date()
      }],
  
      // Un fonctionnement par défaut
      fonctionnements: [{
        id_fonctionnement: 0,
        id_feu: 0,
        mode_fonctionnement: ModeFonctionnement.AUTO,
        date_enregistrement_fonctionnement: new Date()
      }],
  
      // Vide ou non, selon ton besoin
      cycles: []
    };
  }
  
}
