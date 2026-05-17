import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboarduserComponent } from './pages/user/dashboard-user/dashboard-user';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin';
import { ImportFactureComponent } from './pages/facture-upload/facture-upload';
import { ListeFacturesComponent } from './pages/liste-factures/liste-factures';
import { GestionUtilisateursComponent } from './pages/gestion-utilisateurs/gestion-utilisateurs';
import { ReportingComponent } from './pages/reporting/reporting';
import { FactureDetailsComponent } from './pages/facture-details/facture-details';
import { AuthGuard } from './services/auth.guard';
import { DivaltoSyncComponent } from './pages/divalto-sync/divalto-sync';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  {
    path: 'validation',
    loadComponent: () =>
      import('./pages/validation-page/validation-page')
        .then(m => m.ValidationPage)
  },

  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [AuthGuard]
  },

  

  {
    path: 'facture-upload',
    component: ImportFactureComponent,
    canActivate: [AuthGuard]
  },
{
  path: 'dashboard-user',
  component: DashboarduserComponent,
  canActivate: [AuthGuard]  // si tu as un guard
},
  {
    path: 'liste-factures',
    component: ListeFacturesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'facture-details/:id',
    component: FactureDetailsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'reporting',
    component: ReportingComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'gestion-utilisateurs',
    component: GestionUtilisateursComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'synchronisation',
    component: DivaltoSyncComponent,
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: 'login' }
];