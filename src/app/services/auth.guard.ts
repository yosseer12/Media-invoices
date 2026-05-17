import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Vérifier expiration JWT si token présent
    try {
      const parsed  = JSON.parse(user);
      const token   = parsed?.token;

      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry  = payload.exp * 1000;

        if (Date.now() > expiry) {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          return false;
        }
      }
    } catch (e) {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}