import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonApp } from "@ionic/angular/standalone";
import { NavbarComponent } from './shared/navbar/navbar';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, IonApp, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mediasoft-invoices');
}

