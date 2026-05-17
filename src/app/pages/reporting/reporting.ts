import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FactureService } from '../../services/Facture/facture.service';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [CommonModule, NgChartsModule, NavbarComponent],
  templateUrl: './reporting.html',
  styleUrls: ['./reporting.css']
})
export class ReportingComponent implements OnInit {

  report: any = null;
  loading = true;

  monthlyChartType: any = 'line';
  topSuppliersType: any = 'bar';
  statusChartType: any = 'doughnut';

  monthlyChartData: any = { labels: [], datasets: [] };
  topSuppliersData: any = { labels: [], datasets: [] };
  statusChartData: any = {
    labels: ['Validées', 'En attente', 'Rejetées'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }]
  };

  monthlyChartOptions: any = { responsive: true, plugins: { legend: { display: true } } };
  topSuppliersOptions: any = { responsive: true, plugins: { legend: { display: false } } };
  statusChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(
    private factureService: FactureService,
    private zone: NgZone,          // ← AJOUT
    private cdr: ChangeDetectorRef // ← AJOUT
  ) {}

  ngOnInit() {
    this.zone.run(() => this.load());
  }

  load() {
    this.loading = true;

    this.factureService.getReporting().subscribe({
      next: (res: any) => {
        this.zone.run(() => {          // ← WRAP
          console.log("REPORT:", res);
          this.report = { ...res };   // ← nouvelle référence
          this.updateCharts(res);
          this.loading = false;
          this.cdr.detectChanges();   // ← force
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error("REPORT ERROR:", err);
          this.report = { totalFactures: 0, totalHT: 0, totalTTC: 0, totalTVA: 0, monthly: [], topFournisseurs: [] };
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  updateCharts(res: any) {
    const monthly: any[] = res?.monthly || [];
    const top: any[] = res?.topFournisseurs || [];
    const status = res?.status || null;

    // ← Chaque objet est une NOUVELLE référence (obligatoire pour ng2-charts)
    this.monthlyChartData = {
      labels: monthly.map(m => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        return months[m.mois - 1] || 'M' + m.mois;
      }),
      datasets: [{
        label: 'Revenue TTC',
        data: monthly.map(m => m.total),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        fill: true,
        tension: 0.4
      }]
    };

    this.topSuppliersData = {
      labels: top.map(f => f.nom || 'Unknown'),
      datasets: [{
        label: 'Top fournisseurs',
        data: top.map(f => f.total),
        backgroundColor: '#3b82f6'
      }]
    };

    this.statusChartData = status ? {
      labels: ['Validées', 'En attente', 'Rejetées'],
      datasets: [{
        data: [status.validees || 0, status.enAttente || 0, status.rejetees || 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    } : {
      labels: ['Total'],
      datasets: [{ data: [res.totalFactures || 0], backgroundColor: ['#3b82f6'] }]
    };
  }
}