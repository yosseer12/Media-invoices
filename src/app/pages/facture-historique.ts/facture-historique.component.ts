import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FactureService } from '../../services/Facture/facture.service';
import  {DatePipe}  from "@angular/common";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-facture-historique',
  templateUrl: './facture-historique.html',
  styleUrls: ['./facture-historique.css'],
  imports: [DatePipe,CommonModule, FormsModule, RouterModule]
})
export class FactureHistoriqueComponent implements OnInit {

  historique: any[] = [];
  factureId!: number;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private factureService: FactureService
  ) {}

  ngOnInit(): void {
    // récupérer l'id depuis l'URL
    this.factureId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.factureId) {
      this.loadHistorique();
    }
  }

  loadHistorique(): void {
    this.loading = true;
    this.errorMessage = '';

    this.factureService.getHistorique(this.factureId).subscribe({
      next: (data) => {
        this.historique = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement historique:', err);
        this.errorMessage = 'Impossible de charger l’historique';
        this.loading = false;
      }
    });
  }

  // optionnel : couleur selon action
  getActionClass(action: string): string {
    switch (action) {
      case 'Validation':
        return 'validation';
      case 'Rejet':
        return 'rejet';
      case 'Modification':
        return 'modification';
      default:
        return '';
    }
  }
}