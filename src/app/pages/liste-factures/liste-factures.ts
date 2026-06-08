import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-liste-factures',
  templateUrl: './liste-factures.html',
  styleUrls: ['./liste-factures.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent]
})
export class ListeFacturesComponent implements OnInit {
  invoices: any[] = [];
  filteredInvoices: any[] = [];
  search = '';
  statusFilter = '';
  importFilter = '';

  constructor(private factureService: FactureService) {}

  ngOnInit(): void {
    this.invoices = this.factureService.getInvoices();
    this.filteredInvoices = [...this.invoices];
    this.applyFilters();
  }

  applyFilters() {
    this.filteredInvoices = this.invoices.filter(inv => {
      const matchesSearch =
        inv.number.toLowerCase().includes(this.search.toLowerCase()) ||
        inv.supplier.toLowerCase().includes(this.search.toLowerCase());
      const matchesStatus = this.statusFilter ? inv.status === this.statusFilter : true;
      const matchesImport = this.importFilter ? inv.importMethod === this.importFilter : true;
      return matchesSearch && matchesStatus && matchesImport;
    });
  }
}
