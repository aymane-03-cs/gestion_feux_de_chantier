import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

interface User {
  id_utilisateur: number;
  nom: string;
  email_utilisateur: string;
  tel_utilisateur?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUser: User = { id_utilisateur: 0, nom: '', email_utilisateur: '', tel_utilisateur: '' };
  selectedUser: User | null = null;
  showAddForm = false;
  messageSucces = '';
  messageErreur = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log("Données reçues :", data); // ✅ Vérification des données
        this.users = data;
      },
      error: (err) => (this.messageErreur = 'Erreur lors du chargement des utilisateurs.')
    });
  }
  

  addUser() {
    if (this.validateUser(this.newUser)) {
      this.userService.addUser(this.newUser).subscribe({
        next: (user) => {
          this.users.push(user);
          this.messageSucces = 'Utilisateur ajouté avec succès';
          this.cancelForm();
        },
        error: () => (this.messageErreur = 'Erreur lors de l\'ajout de l\'utilisateur.')
      });
    }
  }

  deleteUser(userId: number) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id_utilisateur !== userId);
          this.messageSucces = 'Utilisateur supprimé avec succès';
        },
        error: () => (this.messageErreur = 'Erreur lors de la suppression de l\'utilisateur.')
      });
    }
  }

  private validateUser(user: User): boolean {
    return !!user.nom && !!user.email_utilisateur && /\S+@\S+\.\S+/.test(user.email_utilisateur);
  }

  cancelForm() {
    this.showAddForm = false;
    this.selectedUser = null;
    this.newUser = { id_utilisateur: 0, nom: '', email_utilisateur: '', tel_utilisateur: '' };
  }
}
