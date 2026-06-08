import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FactureService } from '../../services/facture.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './validation.html',
  styleUrls: ['./validation.css']
})
export class ValidationComponent implements OnInit {

  pendingInvoices: any[] = [];

  // reject modal
  showRejectModal = false;
  selectedNumber: string | null = null;
  rejectComment = '';

  constructor(private factureService: FactureService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.pendingInvoices = this.factureService.getPendingInvoices();
  }

  validate(number: string) {
    this.factureService.validateInvoice(number, 'Validée par l\'administrateur');
    this.loadInvoices();
  }

  openRejectModal(number: string) {
    this.selectedNumber = number;
    this.rejectComment = '';
    this.showRejectModal = true;
  }

  confirmReject() {
    if (!this.rejectComment.trim()) {
      alert('Veuillez ajouter un commentaire de rejet.');
      return;
    }
    if (this.selectedNumber) {
      this.factureService.rejectInvoice(this.selectedNumber, this.rejectComment);
    }
    this.showRejectModal = false;
    this.selectedNumber = null;
    this.rejectComment = '';
    this.loadInvoices();
  }

  cancelReject() {
    this.showRejectModal = false;
    this.selectedNumber = null;
    this.rejectComment = '';
  }
}
