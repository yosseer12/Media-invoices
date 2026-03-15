import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-user.html',
  styleUrls: ['./dashboard-user.css']
})
export class DashboardUserComponent {

  // Factures de l'utilisateur
  myInvoices = [
    { number: 'INV-2026-001', supplier: 'Acme Corp', date: '01/03/2026', amount: '15 420,50 €', status: 'Validée', import: 'upload' },
    { number: 'INV-2026-002', supplier: 'Tech Solutions SAS', date: '03/03/2026', amount: '8 750,00 €', status: 'En attente', import: 'email' },
    { number: 'INV-2026-003', supplier: 'Bureau Plus', date: '04/03/2026', amount: '2 340,75 €', status: 'Synchronisée', import: 'api' },
  ];

}