import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardMetrics {
  totalFeux: number;
  totalAlertes: number;
  totalInterventions: number;
  batteryStats: {
    Chargée: number;
    Moyen: number;
    Faible: number;
  };
  alertes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private BASE_URL = 'http://localhost:3000/api/dashboard'; // API backend

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.BASE_URL}/stats`);
  }
}
