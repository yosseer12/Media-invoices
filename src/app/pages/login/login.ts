import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialisation du formulaire
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Fonction submit
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Comptes par défaut
      if (email === 'admin@mediasoft.fr' && password === 'admin123') {
        this.router.navigate(['/dashboard-admin']);
      } else if (email === 'user@mediasoft.fr' && password === 'user123') {
        this.router.navigate(['/dashboard-user']);
      } else {
        alert('Email ou mot de passe incorrect !');
      }
    }
  }
}