import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required]
    });
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }login() {
  if (!this.loginForm.valid) return;

  const payload = {
    email:      this.loginForm.value.email,
    motDePasse: this.loginForm.value.motDePasse
  };

  this.authService.login(payload).subscribe({
    next: () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}'); // ← ici, APRÈS le login
      const role = user?.role;
      console.log('role:', role);

      if (role === 'user') {
        this.router.navigate(['/dashboard-user']);
      } else if (role === 'admin') {
        this.router.navigate(['/dashboard-admin']);
      }
    },
    error: (err: any) => {
      this.errorMessage = err.error || 'Erreur de connexion';
    }
  });
}}