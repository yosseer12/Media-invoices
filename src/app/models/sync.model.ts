export interface Facture {
  idFacture: number;
  numeroFacture: string;
  nomFournisseur: string;
  montantTTC: number;
  statutId: number;
}

export interface SyncHistory {
  id: number;
  factureRef: string;
  client: string;
  amount: number;
  status: string;
  syncedAt: string;
}

export interface DivaltoConfig {
  id?: number;
  url: string;
  databaseName: string;
  username: string;
  password: string;
  isActive: boolean;
}

export interface SyncStatus {
  connected: boolean;
  active: boolean;
  syncedCount: number;
  pendingCount: number;
  nextSyncInMinutes: number;
   autoSyncEnabled: boolean; 
}