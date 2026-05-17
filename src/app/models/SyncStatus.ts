export interface SyncStatus {
  connected: boolean;
  active: boolean;
  autoSyncEnabled: boolean;
  syncedCount: number;
  pendingCount: number;
  nextSyncInMinutes: number;
}

export interface Facture {
  idFacture: number;
  numeroFacture: string;
  nomFournisseur: string;
  montantTTC: number;
  statutId: number;
}

export interface SyncHistory {
  factureRef: string;
  client: string;
  amount: number;
  syncedAt: string;
  success: boolean;
}

export interface DivaltoConfig {
  url: string;
  databaseName: string;
  username: string;
  password: string;
  isActive: boolean;
  autoSyncEnabled: boolean;
}