export interface FactureOCRResult {
  numeroFacture: string;
  nomFournisseur: string;
  montantHt: number;
  montantTva: number;
  montantTtc: number;
  produits: Produit[];
  idUtilisateur?: number; // ajouté côté frontend pour Save
}

export interface Produit {
  Designation: string; // ⚡ PAS designation
  quantite: number;
  prixUnit: number;
  prixHT: number;
}
export interface FactureListe {
  idFacture: number;
  numeroFacture: string;
  dateFacture: string;
  dateReception: string;
  dateEcheance?: string; // si tu as cette info
  devise: string;         // <-- AJOUTE cette ligne
  montantHt: number;
  montantTva: number;
  montantTtc: number;
  idUtilisateur: number;
  statut?: string;        // ou { nom: string } si tu veux
  nomFournisseur?: string; // si tu veux afficher le nom du fournisseur
  fileContent?: any;
  historiqueModifications?: any[];
  resultatOcrs?: any[];
}