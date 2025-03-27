import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="container text-center mt-5">
      <h2 class="text-danger">⛔ Accès refusé</h2>
      <p>Vous n'avez pas l'autorisation d'accéder à cette page.</p>
      <button class="btn btn-primary" (click)="goBack()">Retour</button>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: auto;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
