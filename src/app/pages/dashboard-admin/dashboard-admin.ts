import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule , RouterModule],   
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent {

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    console.log('Déconnexion');
  }

  stats = [
    { title: 'Total factures', value: 5, color: '#4f46e5' },
    { title: 'En attente', value: 2, color: '#f59e0b' },
    { title: 'Validées', value: 1, color: '#10b981' },
    { title: 'Synchronisées', value: 1, color: '#3b82f6' }
  ];

  totalAmount = 57001.45;
  pendingAmount = 34350;

  performance = {
    validation: 20,
    rejection: 20
  };

  invoices = [
    { number: 'INV-2026-001', supplier: 'Acme Corp', date: '01/03/2026', amount: 15420.5, status: 'Validée', import: 'upload' },
    { number: 'INV-2026-002', supplier: 'Tech Solutions SAS', date: '03/03/2026', amount: 8750, status: 'En attente', import: 'email' },
    { number: 'INV-2026-003', supplier: 'Bureau Plus', date: '04/03/2026', amount: 2340.75, status: 'Synchronisée', import: 'api' },
    { number: 'INV-2026-004', supplier: 'Consulting & Co', date: '05/03/2026', amount: 25600, status: 'En attente', import: 'upload' },
    { number: 'INV-2026-005', supplier: 'Énergie France', date: '06/03/2026', amount: 4890.2, status: 'Rejetée', import: 'email' }
  ];

}