import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin';
import { DashboardUserComponent } from './pages/dashboard-user/dashboard-user';
import { ImportFacturesComponent } from './pages/import-factures/import-factures';
import { ListeFacturesComponent } from './pages/liste-factures/liste-factures';
import { FactureDetailsComponent } from './pages/facture-details/facture-details';
import { RouterModule } from '@angular/router'; // <-- IMPORTANT
import { ValidationComponent } from './pages/validation/validation';
import { SynchronisationComponent } from './pages/synchronisation/synchronisation';
import { GestionUtilisateursComponent } from './pages/gestion-utilisateurs/gestion-utilisateurs';
import { ReportingComponent } from './pages/reporting/reporting';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'dashboard-user', component: DashboardUserComponent },
  { path: 'import-factures', component: ImportFacturesComponent },
  {
  path: 'liste-factures',
  component: ListeFacturesComponent
},
  { path: 'facture-details/:id', component: FactureDetailsComponent },
 {path:'validation',component:ValidationComponent},
  {path:'synchronisation',component:SynchronisationComponent},
  {path:'gestion-utilisateurs',component:GestionUtilisateursComponent},
  {path:'reporting',component:ReportingComponent}
];