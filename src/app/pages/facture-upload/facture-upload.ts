// import-facture.component.ts
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-import-facture',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './facture-upload.html',
  styleUrls: ['./facture-upload.css']
})
export class ImportFactureComponent {

  step: 1 | 2 | 3 | 4 = 1;
  selectedFile: File | null = null;
  errorMessage = '';
  saveError = '';
  saving = false;
navbarHeight = 70;
  form = {
    numeroFacture:  '',
    dateFacture:    '',
    nomFournisseur: '',
    montantHt:      0,
    montantTva:     0,
    montantTtc:     0,
    devise:         'TND'
  };

  lignes: any[] = [];
  savedId: number | null = null;
  savedRef = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  get fileSize() {
    return this.selectedFile
      ? (this.selectedFile.size / 1024 / 1024).toFixed(2) + ' MB'
      : '';
  }

  onFileSelected(event: Event) {
    const f = (event.target as HTMLInputElement).files?.[0];
    if (f) this.selectFile(f);
  }

  onDragOver(e: DragEvent) { e.preventDefault(); }

  onDrop(e: DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer?.files[0];
    if (f?.type === 'application/pdf') this.selectFile(f);
    else this.errorMessage = 'Seuls les PDF sont acceptés.';
  }

  selectFile(f: File) {
    if (f.size > 10 * 1024 * 1024) { this.errorMessage = 'Max 10 MB.'; return; }
    this.selectedFile = f;
    this.errorMessage = '';
  }

  removeFile() { this.selectedFile = null; }

  // ── STEP 2 : Extract OCR
  extract() {
    if (!this.selectedFile) return;
    this.step = 2;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('http://localhost:5110/api/facture/extract', formData)
      .subscribe({
        next: (data) => {
          this.zone.run(() => {
            this.form.numeroFacture  = data.numeroFacture  ?? '';
            this.form.nomFournisseur = data.nomFournisseur ?? '';
            this.form.montantHt      = data.montantHt      ?? 0;
            this.form.montantTva     = data.montantTva     ?? 0;
            this.form.montantTtc     = data.montantTtc     ?? 0;
            this.form.devise         = data.devise         ?? 'TND';
            this.lignes              = data.lignes         ?? [];
            if (data.dateFacture) {
              this.form.dateFacture = new Date(data.dateFacture)
                .toISOString().split('T')[0];
            }
            this.step = 3;
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.errorMessage = 'Erreur OCR : ' + (err.error?.message ?? err.status);
            this.step = 1;
            this.cdr.detectChanges();
          });
        }
      });
  }// OPTION B — Angular envoie FormData pour garder le backend tel quel
save() {
  this.saveError = '';
  this.saving = true;

  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.idUtilisateur ?? 1;

  console.log('userId:', userId);        // ✅
  console.log('form:', this.form);       // ✅

  const formData = new FormData();
  formData.append('NumeroFacture',  this.form.numeroFacture);
  formData.append('NomFournisseur', this.form.nomFournisseur ?? '');
  formData.append('DateFacture',    this.form.dateFacture);
  formData.append('DateReception',  new Date().toISOString());
  formData.append('MontantHt',      this.form.montantHt.toString());
  formData.append('MontantTva',     this.form.montantTva.toString());
  formData.append('MontantTTC',     this.form.montantTtc.toString());
  formData.append('Devise',         this.form.devise);
  formData.append('Lignes',         JSON.stringify(this.lignes));
  formData.append('IdUtilisateur',  userId.toString());

  // log tout le formData
  formData.forEach((v, k) => console.log(k, '=', v));

  if (this.selectedFile)
    formData.append('File', this.selectedFile);

  this.http.post<any>(
    'http://localhost:5110/api/facture/save',
    formData
  ).subscribe({
    next: (res) => {
      this.zone.run(() => {
        this.savedId  = res.idFacture;
        this.savedRef = this.form.numeroFacture;
        this.saving   = false;
        this.step     = 4;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/liste-factures']), 2000);
      });
    },
    error: (err) => {
      this.zone.run(() => {
        console.error('Save error full:', err.error);  // ✅
        this.saveError = 'Erreur : ' + (err.error?.error ?? err.error?.message ?? JSON.stringify(err.error));
        this.saving    = false;
        this.cdr.detectChanges();
      });
    }
  });
}  reset() {
    this.step          = 1;
    this.selectedFile  = null;
    this.errorMessage  = '';
    this.saveError     = '';
    this.saving        = false;
    this.savedId       = null;
    this.savedRef      = '';
    this.lignes        = [];
    this.form = {
      numeroFacture: '', dateFacture: '', nomFournisseur: '',
      montantHt: 0, montantTva: 0, montantTtc: 0, devise: 'TND'
    };
  }
}