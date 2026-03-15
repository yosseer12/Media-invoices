import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FactureService } from '../../services/facture.service';

@Component({
  selector: 'app-facture-details',
  templateUrl: './facture-details.html',
  styleUrls: ['./facture-details.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class FactureDetailsComponent implements OnInit {
  facture: any = {};
  history: any[] = [];
  showModal = false;
  modalAction: 'validate' | 'reject' = 'validate';
  comment = '';
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    console.log('Déconnexion');
  }

  constructor(private route: ActivatedRoute, private factureService: FactureService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.facture = this.factureService.getInvoiceByNumber(id);
    this.loadHistory();
  }

  loadHistory() {
    this.history = this.factureService.getHistory();
  }

  download() {
    this.factureService.downloadInvoice(this.facture.number);
  }

  openModal(action: 'validate' | 'reject') {
    this.modalAction = action;
    this.comment = '';
    this.showModal = true;
  }

  confirmAction() {
    if (!this.comment) {
      alert('Veuillez ajouter un commentaire.');
      return;
    }

    if (this.modalAction === 'validate') {
      this.factureService.validateInvoice(this.facture.number, this.comment);
    } else {
      this.factureService.rejectInvoice(this.facture.number, this.comment);
    }

    // Mise à jour en direct
    this.facture = this.factureService.getInvoiceByNumber(this.facture.number);
    this.loadHistory();
    this.showModal = false;
  }

  cancelAction() {
    this.showModal = false;
  }

  goBack() {
    window.history.back();
  }
}