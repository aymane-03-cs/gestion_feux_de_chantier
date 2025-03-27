import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRoles } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // Utilisation de l'API Gateway
  constructor(private http: HttpClient) {}

 
  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { username: email, password }).pipe(
      catchError(err => {
        console.error('Erreur de connexion:', err);
        return throwError(() => new Error('Échec de connexion'));
      })
    );
  }

  // Store the token in local storage, with the user role
  setToken(token: string): void {
    localStorage.setItem('token', token);
    
    console.log("🔑 Token reçu:", token);
    
    const tokenPayload = this.decodeToken(token);

    console.log("🔎 Décodage du Token en Frontend:", tokenPayload); // Ajoutez ce log

    if (tokenPayload && tokenPayload.role) {
        console.log("🎯 Rôle extrait:", tokenPayload.role);
        localStorage.setItem('userRole', tokenPayload.role); // Stocke le rôle en local
        localStorage.setItem('userId', tokenPayload.id); // Stocke l'ID en local
    } else {
        console.error("⚠️ ERREUR: Impossible d'extraire le rôle du token !");
    }
}



private decodeToken(token: string): any | null {
  try {
      const base64Url = token.split('.')[1]; // Extraire la partie du token
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Remplacement nécessaire pour `atob()`
      const jsonPayload = atob(base64); // Décode la chaîne base64
      return JSON.parse(jsonPayload); // Convertit en objet JSON
  } catch (error) {
      console.error('🚨 Erreur de décodage du token:', error);
      return null;
  }
}


  
  

  /** 🔑 Récupère le token stocké */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** 🔑 Récupère le rôle de l'utilisateur */
  getUserRole(): UserRoles | null {
    const role = localStorage.getItem('userRole');
    return role && Object.values(UserRoles).includes(role as UserRoles) ? (role as UserRoles) : null;
  }
  
  // Get the user ID  .. -1 for admin, -2 for null value
  getUserId(): number  {
    if ( this.getUserRole() !== UserRoles.ADMIN) {
      const id = localStorage.getItem('userId');
      return id ? parseInt(id) : -2;
    }else{
      return -1;
    }
  }

  /** 🔑 Vérifie si l'utilisateur est authentifié */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const tokenPayload = this.decodeToken(token);
    if (!tokenPayload) return false;

    const now = Date.now();
    if (now > tokenPayload.exp * 1000) {
      this.logout();
      return false;
    }
    return true;
  }

  /** 🔐 Déconnecte l'utilisateur */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }

  
}
