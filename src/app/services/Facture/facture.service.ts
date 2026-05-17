import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LigneOCR {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}
export interface DashboardFacture {
  idFacture: number;
  numeroFacture: string;
  fournisseur: string;
  dateFacture: string;
  montantTTC: number;
  statutFacture: string;
}
export interface DashboardStats {
  totalFactures: number;
  enAttente: number;
  validees: number;
  rejetees: number;
}
export interface FactureOCR {
  idFacture?: number;
  nomFournisseur: string;
  numeroFacture: string;
  dateFacture: string;
  dateEcheance?: string;
  devise: string;
  adresse?: string;
  montantHt: number;
  montantTva: number;
  montantTtc: number;
  lignes: LigneOCR[];
  idUtilisateur?: number;
statutId?: number;
  // 🔥 AJOUTER CES CHAMPS
  cheminFichier?: string;
  statut?: 'Validée' | 'En attente' | 'Synchronisée' | 'Rejetée';
}
@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private baseUrl = 'http://localhost:5110/api/facture';

  constructor(private http: HttpClient) {}

  getFactures(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  getStats() {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }

  getDashboard() {
    return this.http.get<any>(`${this.baseUrl}/dashboard`);
  }

  getDashboardStats() {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getReporting(): Observable<any> {
    return this.http.get(`http://localhost:5110/api/reporting`);
  }

  upload(file: File): Observable<FactureOCR> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<FactureOCR>(`${this.baseUrl}/upload-save`, formData);
  }

  getHistorique(factureId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${factureId}/historique`);
  }

  saveFacture(facture: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, facture);
  }
getFactureById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}
//user 
getDashboardUser(userId: number) {
  return this.http.get<any>(
    `http://localhost:5110/api/user/facture/dashboard/${userId}`
  );
}
}