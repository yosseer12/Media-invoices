import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private invoices = [

{
number:'INV-2026-001',
supplier:'Acme Corp',
address:'10 Rue de Paris, 75001 Paris',
date:'01/03/2026',
dueDate:'31/03/2026',
lines:[
{description:'Produit A',quantity:2,unitPrice:1000,total:2000}
],
subTotal:2000,
tva:400,
total:2400,
currency:'EUR',
status:'Validée',
importMethod:'upload'
},

{
number:'INV-2026-002',
supplier:'Tech Solutions SAS',
address:'45 Avenue des Champs-Élysées, 75008 Paris',
date:'03/03/2026',
dueDate:'03/04/2026',
lines:[
{description:'Licence logicielle annuelle',quantity:5,unitPrice:1750,total:8750}
],
subTotal:7000,
tva:1750,
total:8750,
currency:'EUR',
status:'En attente',
importMethod:'email'
}

];

private history:any[]=[];

constructor(){}

/* toutes les factures */

getInvoices(){
return this.invoices;
}

/* facture par numéro */

getInvoiceByNumber(number:string){
return this.invoices.find(inv=>inv.number===number);
}

/* ajouter facture */

addInvoice(invoice:any){
this.invoices.push(invoice);
}

/* factures en attente */

getPendingInvoices(){
return this.invoices.filter(inv=>inv.status==='En attente');
}

/* historique global */

getHistory(){
return this.history;
}

/* historique par facture */

getHistoryByInvoice(number:string){
return this.history.filter(h=>h.factureNumber===number);
}

/* validation */

validateInvoice(number:string,comment:string){

const invoice=this.invoices.find(inv=>inv.number===number);

if(invoice){

invoice.status='Validée';

this.history.push({
factureNumber:number,
action:'Validation',
comment:comment,
date:new Date().toLocaleString()
});

}

}

/* rejet */

rejectInvoice({ number, comment }: { number: string; comment: string; }, rejectComment: string){

const invoice=this.invoices.find(inv=>inv.number===number);

if(invoice){

invoice.status='Rejetée';

this.history.push({
factureNumber:number,
action:'Rejet',
comment:comment,
date:new Date().toLocaleString()
});

}

}

/* téléchargement */

downloadInvoice(number:string){

const invoice=this.getInvoiceByNumber(number);

if(!invoice)return;

const blob=new Blob(
[JSON.stringify(invoice,null,2)],
{type:'application/json'}
);

const url=window.URL.createObjectURL(blob);

const a=document.createElement('a');

a.href=url;
a.download=`${invoice.number}.json`;
a.click();

window.URL.revokeObjectURL(url);

}

}