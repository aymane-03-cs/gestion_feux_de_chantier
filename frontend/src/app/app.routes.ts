import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { FireManagementComponent } from './components/fire-management/fire-management.component';
import { AnalyseReportsComponent } from './components/analyse-reports/analyse-reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },

    // ✅ Routes accessibles à tous les utilisateurs authentifiés
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'USER', 'VISITOR'] } },
    { path: 'alert-list', component: AlertListComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'USER', 'VISITOR'] } },
    { path: 'fire-management', component: FireManagementComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'USER', 'VISITOR'] } },
    { path: 'analyse-reports', component: AnalyseReportsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'USER', 'VISITOR'] } },

    // 🔒 Routes restreintes (Company et Guest n'ont pas accès)
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
    { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } }
];
