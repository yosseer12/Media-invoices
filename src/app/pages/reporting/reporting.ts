import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [CommonModule, NgChartsModule, SidebarComponent],
  templateUrl: './reporting.html',
  styleUrls: ['./reporting.css'],
})
export class ReportingComponent {
  // Répartition par statut
  statusChartType: 'pie' = 'pie';
  statusChartData = {
    labels: ['Validées', 'En attente', 'Synchronisées', 'Rejetées'],
    datasets: [{ data: [20, 40, 20, 20], backgroundColor: ['#10b981', '#f59e0b', '#0ea5e9', '#f43f5e'], borderWidth: 0 }]
  };
  statusChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const } } };

  // Évolution mensuelle
  monthlyChartType: 'bar' = 'bar';
  monthlyChartData = {
    labels: ['Jan', 'Fév', 'Mar'],
    datasets: [{ label: 'Montant', data: [0, 15000, 30000], backgroundColor: '#5246e5', borderRadius: 8 }]
  };
  monthlyChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  // Top 5 fournisseurs
  topSuppliersType: 'bar' = 'bar';
  topSuppliersData = {
    labels: ['Consulting & Co', 'Acme Corp', 'Tech Solutions SAS', 'Énergie France', 'Bureau Plus'],
    datasets: [{ label: 'Montant', data: [6500, 13000, 19500, 26000, 15000], backgroundColor: '#8b5cf6', borderRadius: 8 }]
  };
  topSuppliersOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const, plugins: { legend: { display: false } } };
}
