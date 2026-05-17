import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5110/api/auth';

  constructor(private http: HttpClient, private router: Router) {}
login(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
    tap(user => {
      localStorage.setItem('user', JSON.stringify(user));
    })
  );
}

getRole(): string {
  const user = this.getUser();
  return user?.role ?? user?.Role ?? '';
}

getUser() {
  return JSON.parse(localStorage.getItem('user') || 'null');
}
  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}