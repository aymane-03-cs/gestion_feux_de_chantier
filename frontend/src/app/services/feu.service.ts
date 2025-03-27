/**
 * 🔥 FeuService - Traffic Light Management Service
 * -----------------------------------------------
 * This service handles all operations related to traffic lights (Feux).
 * It communicates with the API Gateway (`http://localhost:5000/api/feux`)
 * and applies role-based access control (RBAC).
 *
 * 🛠 Features:
 * - Fetch feux based on user role (Admin, Company User, Visitor).
 * - Secure CRUD operations with role restrictions.
 * - Uses JWT authentication for API requests.
 * - Supports in-memory data simulation for testing.
 *
 * 🚀 Role-Based Access:
 * - Admin (1) → Full access (create, update, delete, view all).
 * - Company User (2) → View and update assigned feux.
 * - Visitor (3) → Read-only access to limited feux.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Feu } from '../model/feu.model';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { UserRoles } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FeuService {
  // private apiUrl = 'http://localhost:3002/api/feux'; // Port du service Feu
  private apiUrl = 'http://localhost:5000/api/feux'; // Utilisation de l'API Gateway

  constructor(private http: HttpClient, private authService: AuthService) {}

  //  Récupérer tous les feux
  getAllFeux(): Observable<Feu[]> {
    if (this.authService.getUserRole() === UserRoles.ADMIN) {
      return this.http.get<Feu[]>(this.apiUrl).pipe(
        tap(feux => console.log('Données reçues du backend:', feux)),
        catchError(error => {
          console.error('Erreur lors du chargement des feux:', error);
          return of([]);
        })
      );
    }else if ( this.authService.getUserRole() === UserRoles.USER) {
      return this.http.get<Feu[]>(`${this.apiUrl}/user/${this.authService.getUserId()}`).pipe(
        tap(feux => console.log('Données reçues du backend loueur:', feux)),
        catchError(error => {
          console.error('Erreur lors du chargement des feux:', error);
          return of([]);
    })
    );
    }else {
      return this.http.get<Feu[]>(`${this.apiUrl}/visitor/${this.authService.getUserId()}`).pipe(
        tap(feux => console.log('Données reçues du backend Visitor :', feux)),
        catchError(error => {
          console.error('Erreur lors du chargement des feux:', error);
          return of([]);
        })
      );
    }
    // return this.http.get<Feu[]>(this.apiUrl).pipe(
    //   tap(feux => console.log('Données reçues du backend:', feux)),
    //   catchError(error => {
    //     console.error('Erreur lors du chargement des feux:', error);
    //     return of([]);
    //   })
    // );
    
  }
  

  // Récupérer un feu par ID
  getFeuById(id: number): Observable<Feu> {
    return this.http.get<Feu>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du feu:', error);
        return of(null as any);
      })
    );
  }

  //  Ajouter un nouveau feu (Seuls les Admins peuvent ajouter)
createFeu(feu: Partial<Feu>): Observable<{ message: string; feuId: number }> {
  if (this.authService.getUserRole() !== UserRoles.ADMIN) {
    console.error('Accès refusé : Seuls les Admins peuvent ajouter des feux.');
    return of(null as any);
  }

  // Construire l'objet avec les clés attendues par l'API backend
  const requestBody = {
    numSerie: feu.num_serie,
    numGroupe: feu.id_groupe || null,
    modeFonctionnement: feu.fonctionnements?.[0]?.mode_fonctionnement || 'Auto',
    etatOptique: feu.etats_optiques?.[0]?.etat_bas || 'Opérationnelle',
    etatBatterie: feu.etats_batteries?.[0]?.type_etat_batterie || 'Plein',
    positionPhysique: feu.positions?.[0]?.position_physique || 1,
    latitude: feu.positions?.[0]?.latitude || 0,
    longitude: feu.positions?.[0]?.longitude || 0
  };

  return this.http.post<{ message: string; feuId: number }>(this.apiUrl, requestBody).pipe(
    catchError(error => {
      console.error("Erreur lors de l'ajout du feu:", error);
      return of(null as any);
    })
  );
}


  // ✅ PUT : Mettre à jour un feu (Admins et Company Users)
  updateFeu(id: number, feu: Partial<Feu>): Observable<Feu> {
    if (![UserRoles.ADMIN, UserRoles.USER].includes(this.authService.getUserRole()!)) {
      console.error('Accès refusé : Seuls les Admins et Company Users peuvent modifier des feux.');
      return of(null as any);
    }
    return this.http.put<Feu>(`${this.apiUrl}/${id}`, feu).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour du feu:', error);
        return of(null as any);
      })
    );
  }

  // ✅ DELETE : Supprimer un feu (Seuls les Admins peuvent supprimer)
  deleteFeu(id: number): Observable<{ message: string }> {
    if (this.authService.getUserRole() !== UserRoles.ADMIN) {
      console.error('Accès refusé : Seuls les Admins peuvent supprimer des feux.');
      return of({ message: 'Non autorisé' });
    }
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression du feu:', error);
        return of({ message: 'Erreur' });
      })
    );
  }
}
