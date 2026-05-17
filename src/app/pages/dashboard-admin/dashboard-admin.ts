import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FactureService } from '../../services/Facture/facture.service';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
})
export class DashboardAdminComponent implements OnInit {

  invoices: any[] = [];
  stats = { total: 0, pending: 0, validated: 0, rejected: 0 };
  loading = true;
  performance = { validation: 0, rejection: 0 };

  constructor(
    private factureService: FactureService,
    private cdr: ChangeDetectorRef   // ← AJOUT
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;

    this.factureService.getDashboard().subscribe({
      next: (data: any) => {
        console.log('dashboard data', data);

        this.invoices = [...(data?.invoices || [])];  // ← spread pour forcer la référence

        this.stats = {
          total: data?.totalAmount || 0,
          pending: data?.pendingAmount || 0,
          validated: data?.stats?.validated || 0,
          rejected: data?.stats?.rejected || 0
        };

        this.performance = {
          validation: data?.performance?.validation || 0,
          rejection: data?.performance?.rejection || 0
        };

        this.loading = false;
        this.cdr.detectChanges();  // ← AJOUT : force la mise à jour du template
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();  // ← AJOUT
      }
    });
  }
}