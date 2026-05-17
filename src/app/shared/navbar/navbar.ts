// navbar.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  isCollapsed = false;
  user: any = null;
constructor(private router: Router) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.user = null;
  
  // ✅ forcer la navigation sans possibilité de retour arrière
  this.router.navigateByUrl('/login', { replaceUrl: true });
}
  
}