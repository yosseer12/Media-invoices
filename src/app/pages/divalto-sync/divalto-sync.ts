import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DivaltoService } from '../../services/divalto.service';
import { NavbarComponent } from "../../shared/navbar/navbar";

export type SyncMode = 'rest' | 'webservice';
export type SyncFrequency = 15 | 30 | 60 | 120;

export interface DivaltoConfig {
  url: string;
  databaseName: string;
  username: string;
  password: string;
  mode: SyncMode;
  autoSyncEnabled: boolean;
  syncFrequency: SyncFrequency;
}

export interface SyncStatus {
  connected: boolean;
  active: boolean;
  autoSyncEnabled: boolean;
  nextSyncInMinutes: number;
  lastSyncAt: string | null;
  lastSyncSuccess: boolean | null;
}

export interface SyncLog {
  id: number;
  factureRef: string;
  fournisseur: string;
  montant: number;
  devise: string;
  syncedAt: string;
  success: boolean;
  errorMessage?: string;
  doublonDetecte: boolean;
}

export interface FactureEnAttente {
  idFacture: number;
  numeroFacture: string;
  nomFournisseur: string;
  montantTtc: number;
  devise: string;
  dateFacture: string;
  statut: string;
}

@Component({
  selector: 'app-divalto-sync',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './divalto-sync.html',
  styleUrls: ['./divalto-sync.css']
})
export class DivaltoSyncComponent implements OnInit, OnDestroy {

  // ── État général ──────────────────────────────────────────
  activeTab: 'overview' | 'config' | 'factures' | 'logs' = 'overview';
  loading = false;
  syncing = false;
  testingConnection = false;
  savingConfig = false;

  // ── Données ───────────────────────────────────────────────
  status: SyncStatus = {
    connected: false,
    active: false,
    autoSyncEnabled: false,
    nextSyncInMinutes: 0,
    lastSyncAt: null,
    lastSyncSuccess: null
  };

  config: DivaltoConfig = {
    url: '',
    databaseName: '',
    username: '',
    password: '',
    mode: 'rest',
    autoSyncEnabled: false,
    syncFrequency: 30
  };

  factures: FactureEnAttente[] = [];
  logs: SyncLog[] = [];
navbarHeight = 70;
  // ── UI State ──────────────────────────────────────────────
  connectionTestResult: 'success' | 'error' | null = null;
  connectionTestMessage = '';
  saveConfigResult: 'success' | 'error' | null = null;
  syncResult: 'success' | 'error' | null = null;
  syncMessage = '';

  showPassword = false;
  logFilter: 'all' | 'success' | 'error' | 'doublon' = 'all';
  searchLog = '';

  private autoRefreshInterval: any;

  constructor(
    private service: DivaltoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAll();
    // Rafraîchissement auto toutes les 60s
    this.autoRefreshInterval = setInterval(() => {
      this.service.getStatus().subscribe(r => {
        this.status = r;
        this.cd.detectChanges();
      });
    }, 60000);
  }

  ngOnDestroy() {
    if (this.autoRefreshInterval) clearInterval(this.autoRefreshInterval);
  }

  // ── Chargement ────────────────────────────────────────────
  loadAll() {
    this.loading = true;

    this.service.getStatus().subscribe({
      next: r => { this.status = r; this.checkLoading(); },
      error: () => this.checkLoading()
    });

    this.service.getFactures().subscribe({
      next: r => { this.factures = r; this.checkLoading(); },
      error: () => this.checkLoading()
    });

    this.service.getHistory().subscribe({
      next: r => { this.logs = r; this.checkLoading(); },
      error: () => this.checkLoading()
    });

    this.service.getConfig().subscribe({
      next: r => { this.config = { ...this.config, ...r }; this.checkLoading(); },
      error: () => this.checkLoading()
    });
  }

  private _loadCount = 0;
  checkLoading() {
    this._loadCount++;
    if (this._loadCount >= 4) {
      this.loading = false;
      this._loadCount = 0;
      this.cd.detectChanges();
    }
  }

  // ── Synchronisation manuelle ──────────────────────────────
  syncNow() {
    this.syncing = true;
    this.syncResult = null;

    this.service.syncNow().subscribe({
      next: (res: any) => {
        this.syncing = false;
        this.syncResult = 'success';
        this.syncMessage = res?.message ?? `${res?.syncedCount ?? 0} facture(s) synchronisée(s)`;
        this.loadAll();
        setTimeout(() => { this.syncResult = null; this.cd.detectChanges(); }, 4000);
      },
      error: (err) => {
        this.syncing = false;
        this.syncResult = 'error';
        this.syncMessage = err?.error?.message ?? 'Erreur lors de la synchronisation';
        this.cd.detectChanges();
        setTimeout(() => { this.syncResult = null; this.cd.detectChanges(); }, 4000);
      }
    });
  }

  // ── Auto sync ─────────────────────────────────────────────
  toggleAutoSync() {
    this.service.setAutoSync(this.status.autoSyncEnabled).subscribe({
      next: () => this.cd.detectChanges(),
      error: () => {
        this.status.autoSyncEnabled = !this.status.autoSyncEnabled;
        this.cd.detectChanges();
      }
    });
  }

  // ── Config ────────────────────────────────────────────────
  testConnection() {
    this.testingConnection = true;
    this.connectionTestResult = null;

    this.service.testConnection(this.config).subscribe({
      next: (res: any) => {
        this.testingConnection = false;
        this.connectionTestResult = 'success';
        this.connectionTestMessage = res?.message ?? 'Connexion réussie';
        this.cd.detectChanges();
      },
      error: (err) => {
        this.testingConnection = false;
        this.connectionTestResult = 'error';
        this.connectionTestMessage = err?.error?.message ?? 'Connexion échouée';
        this.cd.detectChanges();
      }
    });
  }

  saveConfig() {
    this.savingConfig = true;
    this.saveConfigResult = null;

    this.service.saveConfig(this.config).subscribe({
      next: () => {
        this.savingConfig = false;
        this.saveConfigResult = 'success';
        this.cd.detectChanges();
        setTimeout(() => { this.saveConfigResult = null; this.cd.detectChanges(); }, 3000);
      },
      error: () => {
        this.savingConfig = false;
        this.saveConfigResult = 'error';
        this.cd.detectChanges();
      }
    });
  }

  // ── Logs filtrés ──────────────────────────────────────────
  get filteredLogs(): SyncLog[] {
    return this.logs.filter(l => {
      const matchFilter =
        this.logFilter === 'all' ||
        (this.logFilter === 'success' && l.success) ||
        (this.logFilter === 'error' && !l.success) ||
        (this.logFilter === 'doublon' && l.doublonDetecte);

      const matchSearch =
        !this.searchLog ||
        l.factureRef.toLowerCase().includes(this.searchLog.toLowerCase()) ||
        l.fournisseur.toLowerCase().includes(this.searchLog.toLowerCase());

      return matchFilter && matchSearch;
    });
  }

  // ── Stats rapides ─────────────────────────────────────────
  get totalLogs() { return this.logs.length; }
  get successLogs() { return this.logs.filter(l => l.success).length; }
  get errorLogs() { return this.logs.filter(l => !l.success).length; }
  get doublonLogs() { return this.logs.filter(l => l.doublonDetecte).length; }
  get successRate() {
    if (!this.totalLogs) return 0;
    return Math.round((this.successLogs / this.totalLogs) * 100);
  }
}