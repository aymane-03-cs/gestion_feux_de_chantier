import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Feu } from '../model/feu.model';
import { FEUX_MOCK } from './feu.mock';

@Injectable({
  providedIn: 'root'
})
export class FeuService {
  private feux: Feu[] = FEUX_MOCK;

  constructor() {}

  // ✅ Récupérer tous les feux
  getAllFeux(): Observable<Feu[]> {
    return of(this.feux);
  }

  // ✅ Récupérer un feu par ID
  getFeuById(id: number): Observable<Feu | undefined> {
    const feu = this.feux.find(f => f.id_feu === id);
    return of(feu);
  }

  // ✅ Ajouter un feu (Mock)
  createFeu(feu: Partial<Feu>): Observable<Feu> {
    const newFeu = {
      ...feu,
      id_feu: this.feux.length + 1,
      num_serie: `F${1000 + this.feux.length + 1}`,
      date_derniere_maj: new Date()
    } as Feu;

    this.feux.push(newFeu);
    return of(newFeu);
  }

  // ✅ Mettre à jour un feu
  updateFeu(id: number, feu: Partial<Feu>): Observable<Feu | null> {
    const index = this.feux.findIndex(f => f.id_feu === id);
    if (index === -1) return of(null);
    
    this.feux[index] = { ...this.feux[index], ...feu };
    return of(this.feux[index]);
  }

  // ✅ Supprimer un feu
  deleteFeu(id: number): Observable<void> {
    this.feux = this.feux.filter(f => f.id_feu !== id);
    return of(undefined);
  }
}
