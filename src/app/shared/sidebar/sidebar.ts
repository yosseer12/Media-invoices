import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  /** 'admin' shows the full menu, 'user' a reduced one */
  @Input() role: 'admin' | 'user' = 'admin';
  @Input() email = 'admin@mediasoft.fr';

  collapsed = false;

  private readonly adminNav: NavItem[] = [
    { label: 'Tableau de bord', icon: 'grid',    link: '/dashboard-admin' },
    { label: 'Import facture',  icon: 'upload',  link: '/import-factures' },
    { label: 'Liste factures',  icon: 'file',    link: '/liste-factures' },
    { label: 'Validation',      icon: 'check',   link: '/validation' },
    { label: 'Synchronisation', icon: 'sync',    link: '/synchronisation' },
    { label: 'Reporting',       icon: 'chart',   link: '/reporting' },
    { label: 'Utilisateurs',    icon: 'users',   link: '/gestion-utilisateurs' }
  ];

  private readonly userNav: NavItem[] = [
    { label: 'Mes factures',   icon: 'file',   link: '/dashboard-user' },
    { label: 'Import facture', icon: 'upload', link: '/import-factures' },
    { label: 'Liste factures', icon: 'grid',   link: '/liste-factures' }
  ];

  get nav(): NavItem[] {
    return this.role === 'user' ? this.userNav : this.adminNav;
  }

  get initials(): string {
    return (this.email[0] || 'M').toUpperCase();
  }

  get roleLabel(): string {
    return this.role === 'user' ? 'Utilisateur' : 'Administrateur';
  }

  constructor(private router: Router) {}

  toggle() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
