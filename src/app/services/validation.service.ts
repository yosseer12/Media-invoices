import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FactureValidation {
  idFacture: number;
  numeroFacture: string;
  nomFournisseur: string;
  dateFacture: string;
  montantTTC: number;
  montantTva: number;
  statut?: 'Validée' | 'En attente' | 'Synchronisée' | 'Rejetée';
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private apiUrl = 'http://localhost:5110/api/validation';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les factures en attente
  getEnAttente(): Observable<FactureValidation[]> {
    return this.http.get<FactureValidation[]>(`${this.apiUrl}/en-attente`);
  }

  // Valider une facture
  valider(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/valider/${id}`, {});
  }

  // Rejeter une facture avec commentaire
  rejeter(id: number, commentaire: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/rejeter/${id}`, { commentaire });
  }
}