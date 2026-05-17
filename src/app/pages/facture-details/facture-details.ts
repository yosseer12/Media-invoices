import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient }        from '@angular/common/http';
import { FactureService }    from '../../services/Facture/facture.service';
import { NavbarComponent }   from '../../shared/navbar/navbar';

interface HistoriqueItem {
  action:     string;
  dateAction: string;
  motifRejet: string;
}

@Component({
  selector:    'app-facture-details',
  standalone:  true,
  imports:     [CommonModule, NavbarComponent],
  templateUrl: './facture-details.html',
  styleUrls:   ['./facture-details.css']
})
export class FactureDetailsComponent implements OnInit {

  facture:        any  = null;
  loading         = true;
  error           = false;
  montantTTC      = 0;
  navbarHeight    = 70;

  // ── Historique ──
  historique:     HistoriqueItem[] = [];
  loadingHisto    = false;
  showHisto       = false;

  constructor(
    private route:          ActivatedRoute,
    private router:         Router,
    private factureService: FactureService,
    private http:           HttpClient        // ← ajouter
  ) {}
ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  const id      = idParam ? Number(idParam) : null;

  if (!id || isNaN(id)) {
    this.loading = false;
    this.error   = true;
    return;
  }

  this.factureService.getFactureById(id).subscribe({
    next: (data: any) => {
      this.facture = {
        idFacture:      data.idFacture      ?? data.IdFacture,
        numeroFacture:  data.numeroFacture  ?? data.NumeroFacture  ?? '—',
        nomFournisseur: data.nomFournisseur ?? data.NomFournisseur ?? 'Inconnu',
        dateFacture:    data.dateFacture    ?? data.DateFacture    ?? null,
        dateEcheance:   data.dateEcheance   ?? data.DateEcheance   ?? null,
        devise:         data.devise         ?? data.Devise         ?? 'TND',
        montantHt:      data.montantHt      ?? data.MontantHt      ?? 0,
        montantTva:     data.montantTva     ?? data.MontantTva     ?? 0,
        montantTtc:     data.montantTtc     ?? data.montantTTC     ?? data.MontantTTC ?? 0,
        statutId:       data.statutId       ?? data.StatutId       ?? 0,
        motifRejet:     data.motifRejet     ?? data.MotifRejet     ?? null,
        cheminFichier:  data.cheminFichier  ?? data.CheminFichier  ?? null,
        lignes:         (data.lignes ?? data.Lignes ?? []).map((l: any) => ({
          description:  l.description  ?? l.Description  ?? '',
          quantite:     l.quantite     ?? l.Quantite     ?? 0,
          prixUnitaire: l.prixUnitaire ?? l.PrixUnitaire ?? 0,
          total:        l.total        ?? l.Total        ?? 0,
        }))
      };

      this.montantTTC = this.facture.montantTtc ||
        (this.facture.montantHt + this.facture.montantTva);

      this.loading = false; // ✅ débloque l'affichage

      this.chargerHistorique();
    },
    error: (err: any) => {
      console.error('Erreur API:', err.status, err.url);
      this.loading = false;
      this.error   = true;
    }
  });
}chargerHistorique(): void {
  if (!this.facture?.idFacture) return;
  this.loadingHisto = true;
  this.showHisto    = true; // ✅ ouvrir immédiatement, montrer le spinner pendant le chargement

  this.http.get<HistoriqueItem[]>(
    `http://localhost:5110/api/facture/${this.facture.idFacture}/historique`
  ).subscribe({
    next: res => {
      this.historique   = res;
      this.loadingHisto = false;
    },
    error: () => {
      this.loadingHisto = false;
    }
  });
}

  toggleHisto(): void {
    this.showHisto = !this.showHisto;
    // Charger seulement si pas encore chargé
    if (this.showHisto && this.historique.length === 0) {
      this.chargerHistorique();
    }
  }

  getStatusText(id: number): string {
    switch (id) {
      case 1:  return 'En attente';
      case 2:  return 'Validée';
      case 3:  return 'Rejetée';
      case 4:  return 'Synchronisée';
      default: return 'Inconnu';
    }
  }

  getStatusClass(id: number): string {
    switch (id) {
      case 1:  return 'status-pending';
      case 2:  return 'status-validated';
      case 3:  return 'status-rejected';
      case 4:  return 'status-synced';
      default: return 'status-unknown';
    }
  }

  backToList(): void {
    this.router.navigate(['/liste-factures']);
  }
}