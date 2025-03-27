import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      console.log("⛔ Accès refusé : utilisateur non authentifié");
      this.router.navigate(['/login']); 
      return false;
    }
  
    const userRole = this.authService.getUserRole();
    console.log(`🔍 Rôle récupéré dans AuthGuard: ${userRole}`);
  
    const allowedRoles: string[] = route.data['roles'] || [];
    console.log(`📌 Rôles autorisés pour cette route: ${allowedRoles}`);
  
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole || '')) {
      return true;
    }
  
    console.log("🚫 Accès refusé : rôle non autorisé pour cette page");
    this.router.navigate(['/unauthorized']);
    return false;
  }
  
}
