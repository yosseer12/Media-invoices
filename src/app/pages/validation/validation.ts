import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { FormsModule } from '@angular/forms';

@Component({
selector:'app-validation',
standalone:true,
imports:[CommonModule,NgFor,RouterModule,FormsModule],
templateUrl:'./validation.html',
styleUrls:['./validation.css']
})
export class ValidationComponent implements OnInit{

pendingInvoices:any[]=[];
showRejectModal = false;
selectedInvoice: any = null;
comment: string = '';
validateComment: string = '';
rejectComment: string = '';
modalAction: 'validate' | 'reject' = 'validate';
isCollapsed = false;
showModal = false;
constructor(private factureService:FactureService){}

ngOnInit(){

this.loadInvoices();

}
toggleSidebar(){

this.isCollapsed=!this.isCollapsed;}
loadPendingInvoices(){
    this.pendingInvoices = this.factureService.getPendingInvoices();
  }
loadInvoices(){

this.pendingInvoices = this.factureService.getPendingInvoices();

}


  logout() {
    console.log('Déconnexion');
  }

openModal(invoice: any, action: 'validate' | 'reject') {
  this.selectedInvoice = invoice; // objet entier
  this.modalAction = action;
  this.comment = '';
  this.showModal = true;
}
validate(number:string){

this.factureService.validateInvoice(this.selectedInvoice, this.validateComment);
}
openRejectModal(number:string){

this.selectedInvoice = number;
this.showRejectModal = true;

}

confirmReject(){

this.factureService.validateInvoice(this.selectedInvoice, this.validateComment);
this.factureService.rejectInvoice(this.selectedInvoice, this.rejectComment);
this.showRejectModal = false;
this.rejectComment = '';

this.loadInvoices();

}

cancelReject(){

this.showRejectModal = false;
this.rejectComment = '';

}
reject(number:string){

this.factureService.rejectInvoice(this.selectedInvoice.number, this.rejectComment);
}

confirmAction() {
  if (!this.comment) {
    alert('Veuillez ajouter un commentaire.');
    return;
  }

 if (!this.selectedInvoice) return;

if (this.modalAction === 'validate') {
  this.factureService.validateInvoice(this.selectedInvoice.number, this.comment);
} else {
  this.factureService.rejectInvoice(this.selectedInvoice.number, this.comment);
}
  this.loadPendingInvoices(); // mise à jour de la liste
  this.showModal = false;
}

  cancelAction() {
    this.showModal = false;
    this.comment = '';
  }
}