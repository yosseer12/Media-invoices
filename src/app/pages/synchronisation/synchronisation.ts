import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactureService } from '../../services/facture.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-synchronisation',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './synchronisation.html',
  styleUrls: ['./synchronisation.css']
})
export class SynchronisationComponent implements OnInit {

  history: any[] = [];
  connected = true;
  autoSync = true;
  syncedCount = 1;

  constructor(private factureService: FactureService) {}

  ngOnInit() {
    this.history = this.factureService.getHistory();
  }

  get pendingInvoices() {
    return this.factureService.getPendingInvoices().length;
  }

  syncNow() {
    const pending = this.factureService.getPendingInvoices();
    pending.forEach(inv => {
      this.factureService.validateInvoice(inv.number, 'Synchronisé avec ERP Divalto');
    });
    this.history = this.factureService.getHistory();
    this.syncedCount += pending.length;
    alert('Synchronisation terminée');
  }

  testConnection() {
    alert('Connexion à Divalto réussie');
  }

  saveConfig() {
    alert('Configuration enregistrée');
  }
}
