import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar';

interface HistoriqueItem {
  action:      string;
  dateAction:  string;
  motifRejet?: string;
}

interface FactureVM {
  idFacture:      number;
  numeroFacture:  string;
  nomFournisseur: string;
  montantTtc:     number;
  cheminFichier:  string | null;
  historique:     HistoriqueItem[];
  loadingHisto:   boolean;   // état de chargement de l'historique par facture
  showHisto:      boolean;   // toggle affichage
}

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './validation-page.html',
  styleUrls: ['./validation-page.css']
})
export class ValidationPage implements OnInit {

  factures:     FactureVM[] = [];
  loading      = true;
  errorMessage = '';
  navbarHeight = 70;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.loading      = true;
    this.errorMessage = '';

    this.http.get<any[]>('http://localhost:5110/api/facture/en-attente').subscribe({
      next: res => {
        this.zone.run(() => {
          this.factures = res.map(f => ({
            idFacture:      f.idFacture,
            numeroFacture:  f.numeroFacture  ?? '',
            nomFournisseur: f.nomFournisseur ?? 'Inconnu',
            montantTtc:     f.montantTtc     ?? ((f.montantHt ?? 0) + (f.montantTva ?? 0)),
            cheminFichier:  f.cheminFichier  ?? null,
            historique:     [],
            loadingHisto:   false,
            showHisto:      false
          }));
          if (this.factures.length === 0) {
            this.errorMessage = 'Aucune facture en attente pour le moment.';
          }
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: err => {
        this.zone.run(() => {
          console.error('Erreur chargement factures:', err);
          this.errorMessage = 'Erreur lors du chargement des factures.';
          this.loading      = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
// ✅ Backend uses [FromQuery] string motif — keep it in the URL
validerFacture(id: number): void {
  if (!confirm('Confirmer la validation de cette facture ?')) return;

  this.http.post(`http://localhost:5110/api/facture/valider/${id}?userId=1`, {}).subscribe({
    next: () => {
      this.loadFacturesEtOuvrirHisto(id); // ← ouvre l'histo après reload
    },
    error: err => {
      console.error('Erreur validation:', err);
      alert(`Erreur: ${err?.error?.message ?? err.status}`);
    }
  });
}

rejeterFacture(id: number): void {
  const motif = prompt('Motif du rejet :');
  if (!motif?.trim()) return;

  this.http.post(
    `http://localhost:5110/api/facture/rejeter/${id}?userId=1&motif=${encodeURIComponent(motif.trim())}`,
    {}
  ).subscribe({
    next: () => {
      this.loadFacturesEtOuvrirHisto(id); // ← ouvre l'histo après reload
    },
    error: err => {
      console.error('Erreur rejet:', err);
      alert(`Erreur: ${err?.error?.message ?? err.status}`);
    }
  });
}

// Nouvelle méthode : reload la liste puis ouvre automatiquement l'histo de la facture traitée
private loadFacturesEtOuvrirHisto(idCible: number): void {
  this.loading      = true;
  this.errorMessage = '';

  this.http.get<any[]>('http://localhost:5110/api/facture/en-attente').subscribe({
    next: res => {
      this.zone.run(() => {
        this.factures = res.map(f => ({
          idFacture:      f.idFacture,
          numeroFacture:  f.numeroFacture  ?? '',
          nomFournisseur: f.nomFournisseur ?? 'Inconnu',
          montantTtc:     f.montantTtc     ?? ((f.montantHt ?? 0) + (f.montantTva ?? 0)),
          cheminFichier:  f.cheminFichier  ?? null,
          historique:     [],
          loadingHisto:   false,
          showHisto:      false
        }));

        if (this.factures.length === 0) {
          this.errorMessage = 'Aucune facture en attente pour le moment.';
        }

        this.loading = false;

        // Chercher la facture cible dans la nouvelle liste
        // (elle peut encore y être si en-attente, ou absente si statut changé)
        const facture = this.factures.find(f => f.idFacture === idCible);

        if (facture) {
          // Facture encore dans la liste → ouvrir son histo directement
          this.ouvrirHistorique(facture);
        } else {
          // Facture disparue de la liste (statut changé) → charger l'histo séparément et l'afficher
          this.afficherHistoriqueStandalone(idCible);
        }

        this.cdr.detectChanges();
      });
    },
    error: err => {
      this.zone.run(() => {
        console.error('Erreur chargement factures:', err);
        this.errorMessage = 'Erreur lors du chargement des factures.';
        this.loading      = false;
        this.cdr.detectChanges();
      });
    }
  });
}

// Ouvre et charge l'histo d'une facture encore dans la liste
private ouvrirHistorique(facture: FactureVM): void {
  facture.historique   = [];   // reset pour forcer le rechargement
  facture.showHisto    = true;
  facture.loadingHisto = true;

  this.http.get<HistoriqueItem[]>(
    `http://localhost:5110/api/facture/${facture.idFacture}/historique`
  ).subscribe({
    next: res => this.zone.run(() => {
      facture.historique   = res;
      facture.loadingHisto = false;
      this.cdr.detectChanges();
    }),
    error: () => this.zone.run(() => {
      facture.loadingHisto = false;
      this.cdr.detectChanges();
    })
  });
}

// Cas où la facture n'est plus dans la liste en-attente après validation/rejet
// → afficher l'histo dans une alerte simple ou un panneau dédié
histoStandalone: HistoriqueItem[] = [];
histoStandaloneVisible            = false;
histoStandaloneId: number | null  = null;

private afficherHistoriqueStandalone(id: number): void {
  this.http.get<HistoriqueItem[]>(
    `http://localhost:5110/api/facture/${id}/historique`
  ).subscribe({
    next: res => this.zone.run(() => {
      this.histoStandalone        = res;
      this.histoStandaloneVisible = true;
      this.histoStandaloneId      = id;
      this.cdr.detectChanges();
    })
  });
}

fermerHistoStandalone(): void {
  this.histoStandaloneVisible = false;
  this.histoStandalone        = [];
  this.histoStandaloneId      = null;
}
toggleHistorique(facture: FactureVM): void {
  facture.showHisto = !facture.showHisto;

  // ✅ FIX: recharger si ouvert ET cache vide
  if (facture.showHisto && facture.historique.length === 0) {
    facture.loadingHisto = true;

    this.http.get<HistoriqueItem[]>(
      `http://localhost:5110/api/facture/${facture.idFacture}/historique`
    ).subscribe({
      next: res => this.zone.run(() => {
        facture.historique   = res;
        facture.loadingHisto = false;
        this.cdr.detectChanges();
      }),
      error: err => this.zone.run(() => {
        console.error('Erreur historique:', err);
        facture.loadingHisto = false;
        this.cdr.detectChanges();
      })
    });
  }
}
  ouvrirPdf(chemin: string | null): void {
    if (!chemin) { alert('Aucun PDF disponible.'); return; }
    window.open(`http://localhost:5110/Uploads/${encodeURIComponent(chemin)}`, '_blank');
  }
}