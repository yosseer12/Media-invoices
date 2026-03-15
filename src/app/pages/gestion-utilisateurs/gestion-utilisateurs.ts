import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrateur' | 'Utilisateur';
  createdAt: string;
  status: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion-utilisateurs.html',
  styleUrls: ['./gestion-utilisateurs.css']
})
export class GestionUtilisateursComponent {

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  users: User[] = [
    {id:1,name:'Admin User',email:'admin@mediasoft.fr',role:'Administrateur',createdAt:'15/01/2026',status:'Actif'},
    {id:2,name:'Regular User',email:'user@mediasoft.fr',role:'Utilisateur',createdAt:'01/02/2026',status:'Actif'},
    {id:3,name:'Marie Dupont',email:'marie.dupont@mediasoft.fr',role:'Utilisateur',createdAt:'15/02/2026',status:'Actif'},
    {id:4,name:'Jean Martin',email:'jean.martin@mediasoft.fr',role:'Utilisateur',createdAt:'01/03/2026',status:'Actif'}
  ];

  searchText = signal('');

  // Modal
  showModal = signal(false);
  modalTitle = signal('Ajouter un utilisateur');
  editingUser: User | null = null;
  formUser: Partial<User> = {};

  // Ouvrir modal pour ajouter ou modifier
  openAddModal() {
    this.modalTitle.set('Ajouter un utilisateur');
    this.formUser = {};
    this.editingUser = null;
    this.showModal.set(true);
  }

  openEditModal(user: User) {
    this.modalTitle.set('Modifier utilisateur');
    this.formUser = {...user};
    this.editingUser = user;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formUser = {};
    this.editingUser = null;
  }

  saveUser() {
    if(this.editingUser) {
      // Modifier
      Object.assign(this.editingUser, this.formUser);
    } else {
      // Ajouter
      const newUser: User = {
        id: this.users.length + 1,
        name: this.formUser.name || '',
        email: this.formUser.email || '',
        role: this.formUser.role as 'Administrateur'|'Utilisateur' || 'Utilisateur',
        createdAt: new Date().toLocaleDateString(),
        status: this.formUser.status as 'Actif'|'Inactif' || 'Actif'
      };
      this.users.push(newUser);
    }
    this.closeModal();
  }

  deleteUser(user: User) {
    if(confirm(`Supprimer ${user.name} ?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }

  logout() {
    console.log('Déconnexion');
  }
}