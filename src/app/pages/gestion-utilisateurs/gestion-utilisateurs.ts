import { Component, signal, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar';

// ✅ Validateur email
function isEmailValue(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface User {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  login: string;
  motDePasse: string;
  role: string;
  dateCreation: string;
  actif: boolean;
}

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './gestion-utilisateurs.html',
  styleUrls: ['./gestion-utilisateurs.css']
})
export class GestionUtilisateursComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  users: User[] = [];
  filteredUsers: User[] = [];
  searchText = '';
  isCollapsed = false;
  navbarHeight = 70;
  showModal = signal(false);
  modalTitle = signal('Ajouter un utilisateur');
  editingUser: User | null = null;
  formUser: Partial<User> = {};
  showPassword = false;
  loginError = '';  // ✅ message d'erreur login

  // ✅ exposer la fonction au template
  isEmailValue = isEmailValue;

  toggleSidebar() { this.isCollapsed = !this.isCollapsed; }
  togglePassword() { this.showPassword = !this.showPassword; }

  ngOnInit() {
    this.zone.run(() => {
      this.loadUsers();
    });
  }

  private refreshLists(data: User[]) {
    this.zone.run(() => {
      this.users = data;
      this.filteredUsers = [...data];
      this.cdr.detectChanges();
    });
  }

  loadUsers() {
    this.http.get<User[]>('http://localhost:5110/api/utilisateurs')
      .subscribe({
        next: data => this.refreshLists(data),
        error: err => console.error('Erreur chargement:', err)
      });
  }

  filterUsers() {
    this.zone.run(() => {
      const search = this.searchText.toLowerCase().trim();
      if (!search) {
        this.filteredUsers = [...this.users];
      } else {
        this.filteredUsers = this.users.filter(u =>
          (u.nom ?? '').toLowerCase().includes(search) ||
          (u.email ?? '').toLowerCase().includes(search) ||
          (u.login ?? '').toLowerCase().includes(search)
        );
      }
    });
  }

  openAddModal() {
    this.modalTitle.set('Ajouter un utilisateur');
    this.formUser = {};
    this.editingUser = null;
    this.loginError = '';  // ✅ reset erreur
    this.showModal.set(true);
  }

  openEditModal(user: User) {
    this.modalTitle.set('Modifier utilisateur');
    this.formUser = { ...user };
    this.formUser.motDePasse = '';
    this.editingUser = user;
    this.loginError = '';  // ✅ reset erreur
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formUser = {};
    this.editingUser = null;
    this.loginError = '';  // ✅ reset erreur
  }

  // ✅ appelé depuis le template à chaque frappe
  onLoginInput() {
    const login = this.formUser.login ?? '';
    this.loginError = isEmailValue(login)
      ? 'Le login ne peut pas être une adresse email'
      : '';
  }

  saveUser() {
    this.loginError = '';

    // ✅ bloquer si login est une adresse email
    if (isEmailValue(this.formUser.login ?? '')) {
      this.loginError = 'Le login ne peut pas être une adresse email';
      return;
    }

    const payload = {
      nom:        this.formUser.nom,
      prenom:     this.formUser.prenom ?? '',
      email:      this.formUser.email,
      login:      this.formUser.login,
      motDePasse: this.formUser.motDePasse ?? '',
      role:       this.formUser.role,
      actif:      this.formUser.actif ?? true
    };

    if (this.editingUser) {
      this.http.put(
        `http://localhost:5110/api/utilisateurs/${this.editingUser.idUtilisateur}`,
        payload
      ).subscribe({
        next: () => { this.loadUsers(); this.closeModal(); },
        error: err => console.error('Erreur update:', err.error)
      });
    } else {
      this.http.post<User>('http://localhost:5110/api/utilisateurs', payload)
        .subscribe({
          next: (newUser) => {
            this.refreshLists([...this.users, newUser]);
            this.closeModal();
          },
          error: err => console.error('Erreur create:', err.error)
        });
    }
  }

  deleteUser(user: User) {
    this.http.delete(`http://localhost:5110/api/utilisateurs/${user.idUtilisateur}`)
      .subscribe({
        next: () => {
          const updated = this.users.filter(u => u.idUtilisateur !== user.idUtilisateur);
          this.refreshLists(updated);
        },
        error: err => console.error('Erreur delete:', err)
      });
  }

  logout() { console.log('Déconnexion'); }
}