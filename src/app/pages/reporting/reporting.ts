import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [CommonModule, NgChartsModule, DecimalPipe],
  templateUrl: './reporting.html',
  styleUrls: ['./reporting.css'],
})
export class ReportingComponent {
  // Répartition par statut
  statusChartType: 'pie' = 'pie';
  isCollapsed = false;
  statusChartData = {
    labels: ['Validées', 'En attente', 'Synchronisées', 'Rejetées'],
    datasets: [{ data: [20, 40, 20, 20], backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'] }]
  };
  statusChartOptions = { responsive: true, plugins: { legend: { position: 'top' as const } } };
toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    console.log('Déconnexion');
  }
  // Évolution mensuelle
  monthlyChartType: 'bar' = 'bar';
  monthlyChartData = {
    labels: ['Jan', 'Fév', 'Mar'],
    datasets: [{ label: 'Montant', data: [0, 15000, 30000], backgroundColor: '#4f46e5' }]
  };
  monthlyChartOptions = { responsive: true };

  // Top 5 fournisseurs
  topSuppliersType: 'bar' = 'bar';
  topSuppliersData = {
    labels: ['Consulting & Co', 'Acme Corp', 'Tech SolutionsSAS', 'Énergie France', 'Bureau Plus'],
    datasets: [{ label: 'Montant', data: [6500, 13000, 19500, 26000, 15000], backgroundColor: '#2563eb' }]
  };
  topSuppliersOptions = { responsive: true };
}