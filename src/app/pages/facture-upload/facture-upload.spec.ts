import { Component } from '@angular/core';
import { FactureService } from '../../services/Facture/facture.service';

@Component({
  selector: 'app-upload',
  templateUrl: './UploadComponent.html'
})
export class UploadComponent {

  file!: File;
  facture: any;

  constructor(private service: FactureService) {}

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  upload() {
    this.service.upload(this.file).subscribe(res => {
      this.facture = (res as any).ocr;
    });
  }
}