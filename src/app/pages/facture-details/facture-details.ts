import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-facture-details',
  templateUrl: './facture-details.html',
  styleUrls: ['./facture-details.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent]
})
export class FactureDetailsComponent implements OnInit {
  facture: any = {};
  history: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.facture = this.factureService.getInvoiceByNumber(id) || {};
    this.loadHistory();
  }

  loadHistory() {
    // Historique propre à cette facture
    this.history = this.factureService.getHistoryByInvoice(this.facture.number);
  }

  download() {
    this.factureService.downloadInvoice(this.facture.number);
  }

  goBack() {
    this.router.navigate(['/liste-factures']);
  }
}
