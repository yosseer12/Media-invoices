import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FactureService } from '../../services/facture.service';
@Component({
  selector: 'app-import-factures',
  standalone: true,   
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './import-factures.html',
  styleUrls: ['./import-factures.css']
})
export class ImportFacturesComponent {
constructor(private factureService: FactureService) {}
  selectedFile: File | null = null;
  fileName = '';
  fileSize = '';
  extractedData: any = null;
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    console.log('Déconnexion');
  }


  onFileSelected(event: any) {

  const file: File = event.target.files[0];

  if (file) {

    this.selectedFile = file;
    this.fileName = file.name;
    this.fileSize = (file.size / 1024).toFixed(1) + ' KB';

    // extraction directe sans attente
    this.extractedData = {
      supplier: 'Tech Solutions SAS',
      invoiceNumber: 'INV-2026-002',
      date: '2026-03-03',
      currency: 'EUR',
      amountHT: 7000,
      tva: 1750,
      total: 8750,
      status: 'En attente'
    };

  }
}
  
  
  cancel() {
    this.extractedData = null;
    this.selectedFile = null;
  }

 saveInvoice() {

const newInvoice = {    number: this.extractedData.invoiceNumber,
    supplier: this.extractedData.supplier,
    address: 'Adresse inconnue',
    date: this.extractedData.date,
    dueDate: this.extractedData.date,

    lines: [
      {
        description: 'Service importé',
        quantity: 1,
        unitPrice: this.extractedData.amountHT,
        total: this.extractedData.amountHT
      }
    ],

    subTotal: this.extractedData.amountHT,
    tva: this.extractedData.tva,
    total: this.extractedData.total,
    currency: this.extractedData.currency,

    status: this.extractedData.status,
    importMethod: 'upload'
  };

  this.factureService.addInvoice(newInvoice);

  alert('Facture enregistrée');

  this.extractedData = null;
  this.selectedFile = null;
}
}