import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

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
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './gestion-utilisateurs.html',
  styleUrls: ['./gestion-utilisateurs.css']
})
export class GestionUtilisateursComponent {

  users: User[] = [
    {id:1,name:'Admin User',email:'admin@mediasoft.fr',role:'Administrateur',createdAt:'15/01/2026',status:'Actif'},
    {id:2,name:'Regular User',email:'user@mediasoft.fr',role:'Utilisateur',createdAt:'01/02/2026',status:'Actif'},
    {id:3,name:'Marie Dupont',email:'marie.dupont@mediasoft.fr',role:'Utilisateur',createdAt:'15/02/2026',status:'Actif'},
    {id:4,name:'Jean Martin',email:'jean.martin@mediasoft.fr',role:'Utilisateur',createdAt:'01/03/2026',status:'Actif'}
  ];

  searchText = '';

  // Modal
  showModal = false;
  modalTitle = 'Ajouter un utilisateur';
  editingUser: User | null = null;
  formUser: Partial<User> = {};

  get filteredUsers(): User[] {
    const q = this.searchText.toLowerCase();
    return this.users.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  get adminCount() { return this.users.filter(u => u.role === 'Administrateur').length; }
  get activeCount() { return this.users.filter(u => u.status === 'Actif').length; }

  openAddModal() {
    this.modalTitle = 'Ajouter un utilisateur';
    this.formUser = { role: 'Utilisateur', status: 'Actif' };
    this.editingUser = null;
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.modalTitle = 'Modifier utilisateur';
    this.formUser = { ...user };
    this.editingUser = user;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formUser = {};
    this.editingUser = null;
  }

  saveUser() {
    if (this.editingUser) {
      Object.assign(this.editingUser, this.formUser);
    } else {
      const newUser: User = {
        id: this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
        name: this.formUser.name || '',
        email: this.formUser.email || '',
        role: (this.formUser.role as 'Administrateur' | 'Utilisateur') || 'Utilisateur',
        createdAt: new Date().toLocaleDateString('fr-FR'),
        status: (this.formUser.status as 'Actif' | 'Inactif') || 'Actif'
      };
      this.users.push(newUser);
    }
    this.closeModal();
  }

  deleteUser(user: User) {
    if (confirm(`Supprimer ${user.name} ?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }
}
