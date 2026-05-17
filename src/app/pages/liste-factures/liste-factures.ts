import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { FormsModule }                           from '@angular/forms';
import { Router }                                from '@angular/router';
import { DomSanitizer, SafeResourceUrl }         from '@angular/platform-browser';

import { FactureService, FactureOCR } from '../../services/Facture/facture.service';
import { NavbarComponent }            from '../../shared/navbar/navbar';

type StatutFacture = 'Validée' | 'En attente' | 'Synchronisée' | 'Rejetée';

@Component({
  selector:     'app-liste-factures',
  standalone:   true,
  imports:      [CommonModule, FormsModule, NavbarComponent],
  templateUrl:  './liste-factures.html',
  styleUrls:    ['./liste-factures.css']
})
export class ListeFacturesComponent implements OnInit {

  /* ── Données ──────────────────────────────────────────── */
  factures:         FactureOCR[] = [];
  filteredFactures: FactureOCR[] = [];

  /* ── Filtres ──────────────────────────────────────────── */
  selectedStatus: StatutFacture | 'toutes' = 'toutes';
  searchText = '';

  /* ── UI ───────────────────────────────────────────────── */
  navbarHeight = 70;
  loading      = true;
  error        = '';

  /* ── Modale PDF ───────────────────────────────────────── */
  pdfUrl:      SafeResourceUrl | null = null;  // URL sécurisée pour l'iframe
  pdfRawUrl    = '';                            // URL brute pour le lien "Ouvrir"
  pdfFileName  = '';                            // Nom affiché dans le header
  pdfLoading   = false;                         // Spinner iframe

  /* ── Base URL du backend ──────────────────────────────── */
  private readonly API_BASE = 'http://localhost:5110';

  constructor(
    private factureService: FactureService,
    private router:         Router,
    private cd:             ChangeDetectorRef,
    private sanitizer:      DomSanitizer          // ← requis pour SafeResourceUrl
  ) {}

  /* ════════════════════════════════════════════════════════
     Cycle de vie
     ════════════════════════════════════════════════════════ */
  ngOnInit(): void {
    this.loadFactures();
  }

  /* ════════════════════════════════════════════════════════
     Chargement des factures
     ════════════════════════════════════════════════════════ */
  loadFactures(): void {
    this.loading = true;
    this.error   = '';

    this.factureService.getFactures().subscribe({
      next: (res: any[]) => {
        this.factures = res.map(f => ({
          idFacture:      f.idFacture,
          numeroFacture:  f.numeroFacture  ?? '',
          nomFournisseur: f.nomFournisseur ?? 'Inconnu',
          dateFacture:    f.dateFacture    ?? null,
          montantHt:      f.montantHt      ?? 0,
          montantTva:     f.montantTva     ?? 0,
          montantTtc:     f.montantTtc     ?? ((f.montantHt ?? 0) + (f.montantTva ?? 0)),
          lignes:         f.lignes         ?? [],
          idUtilisateur:  f.idUtilisateur,
          cheminFichier:  f.cheminFichier  ?? null,
          devise:         f.devise         ?? 'TND',
          statut:         this.resolveStatut(f)
        }));

        this.loading = false;
        this.applyFilter();
        this.cd.detectChanges();
      },
      error: err => {
        this.error   = 'Impossible de charger les factures.';
        this.loading = false;
        console.error('Erreur factures:', err);
        this.cd.detectChanges();
      }
    });
  }

  /* ════════════════════════════════════════════════════════
     Résolution du statut
     ════════════════════════════════════════════════════════ */
  resolveStatut(f: any): StatutFacture {
    if (f.statut) return f.statut as StatutFacture;
    switch (f.statutId) {
      case 1:  return 'En attente';
      case 2:  return 'Validée';
      case 3:  return 'Rejetée';
      case 4:  return 'Synchronisée';
      default: return 'En attente';
    }
  }

  /* ════════════════════════════════════════════════════════
     Filtrage
     ════════════════════════════════════════════════════════ */
  applyFilter(): void {
    const text = this.searchText.toLowerCase().trim();

    this.filteredFactures = this.factures.filter(f =>
      (this.selectedStatus === 'toutes' || f.statut === this.selectedStatus) &&
      (
        (f.numeroFacture  ?? '').toLowerCase().includes(text) ||
        (f.nomFournisseur ?? '').toLowerCase().includes(text)
      )
    );
  }

  /* ════════════════════════════════════════════════════════
     Classes CSS des statuts
     ════════════════════════════════════════════════════════ */
  getStatutClass(statut: string): string {
    switch (statut) {
      case 'Validée':      return 'status-valide';
      case 'En attente':   return 'status-attente';
      case 'Synchronisée': return 'status-sync';
      case 'Rejetée':      return 'status-rejet';
      default:             return 'status-attente';
    }
  }

  /* ════════════════════════════════════════════════════════
     Affichage PDF dans la modale
     ════════════════════════════════════════════════════════ */
  viewPdf(facture: any): void {
    if (!facture.cheminFichier) return;

    // Normalise les backslashes Windows → forward-slashes
    const path = facture.cheminFichier.replace(/\\/g, '/');

    // Supprime le slash initial s'il est déjà présent pour éviter les doubles
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    this.pdfRawUrl   = `${this.API_BASE}/${cleanPath}`;
    this.pdfFileName = cleanPath.split('/').pop() ?? 'document.pdf';
    this.pdfLoading  = true;

    // bypassSecurityTrustResourceUrl est nécessaire pour que Angular
    // accepte une URL externe dans un [src] d'iframe
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfRawUrl);
  }

  /* ════════════════════════════════════════════════════════
     Fermeture de la modale
     ════════════════════════════════════════════════════════ */
  closePdf(): void {
    this.pdfUrl     = null;
    this.pdfRawUrl  = '';
    this.pdfFileName = '';
    this.pdfLoading  = false;
  }

  /* ════════════════════════════════════════════════════════
     Callback : iframe chargée → masque le spinner
     ════════════════════════════════════════════════════════ */
  onPdfLoaded(): void {
    this.pdfLoading = false;
    this.cd.detectChanges();
  }

  /* ════════════════════════════════════════════════════════
     Navigation vers le détail
     ════════════════════════════════════════════════════════ */
  goToDetails(facture: any): void {
    this.router.navigate(['/facture-details', facture.idFacture]);
  }
}