import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../components/page-header.component';
import { SearchBarComponent } from '../components/search-bar.component';
import { UsersTableComponent } from '../components/users-table.component';
import { UserTableRow, Role, User } from '../../features/auth-users/models/auth.model';
import { AdminUsersService } from '../services/admin-users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchBarComponent,
    UsersTableComponent
  ],
  template: `
    <div class="flex flex-col flex-1">
      <app-page-header
        breadcrumb="Admin"
        subBreadcrumb="Gestion Utilisateurs"
        title="Liste des Utilisateurs"
        [showAction]="false">
      </app-page-header>

      <app-search-bar
        placeholder="Rechercher par email..."
        (search)="onSearch($event)">
      </app-search-bar>

      <app-users-table
        [users]="filteredUsers()"
        (delete)="onDeleteUser($event)">
      </app-users-table>
    </div>
  `
})
export class UsersListComponent {
  private adminUsersService = inject(AdminUsersService);

  users = signal<UserTableRow[]>([]);
  searchQuery = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  totalUsers = computed(() => this.users().length);

  filteredUsers = computed(() => {
    let filtered = [...this.users()];

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.name?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.adminUsersService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users.set(users.map(user => this.mapUserToTableRow(user)));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage.set('Erreur lors du chargement des utilisateurs');
        this.isLoading.set(false);
      }
    });
  }

  mapUserToTableRow(user: User): UserTableRow {
    return {
      ...user,
      isActive: true,
      isBanned: false
    };
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onDeleteUser(user: UserTableRow): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.email}" ?`)) {
      this.adminUsersService.deleteUser(user.id).subscribe({
        next: (response) => {
          console.log(response.message);
          // Reload users after deletion
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Erreur lors de la suppression de l\'utilisateur');
        }
      });
    }
  }
}
