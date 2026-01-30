import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTableRow } from '../../features/auth-users/models/auth.model';

@Component({
  selector: 'app-users-table',
  imports: [CommonModule],
  template: `
    <section class="px-8 py-4 flex-1">
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-xl shadow-black/5 border border-slate-200 dark:border-white/5 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Avatar</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email & Identité</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Rôle</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date de création</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Statut</th>
                <th class="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              @for (user of users; track user.id) {
              <tr 
                class="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                <!-- Avatar -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="size-12 rounded-full border-2 border-slate-100 dark:border-white/10 bg-slate-600 shadow-sm flex items-center justify-center text-white font-bold">
                    {{ getInitials(user) }}
                  </div>
                </td>

                <!-- Email & Identity -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-900 dark:text-white">
                      {{ getFullName(user) }}
                    </span>
                    <span class="text-xs font-medium text-slate-400">{{ user.email }}</span>
                  </div>
                </td>

                <!-- Role Badge -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span 
                    [ngClass]="getRoleBadgeClass(user.role)"
                    class="px-3 py-1 rounded-full text-[10px] font-black border">
                    {{ user.role }}
                  </span>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {{ user.createdAt | date: 'dd MMM yyyy' }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span 
                      [ngClass]="{
                        'bg-emerald-500 shadow-emerald-500/50': user.isActive && !user.isBanned,
                        'bg-slate-400': !user.isActive && !user.isBanned,
                        'bg-red-500 shadow-red-500/50': user.isBanned
                      }"
                      class="size-2 rounded-full shadow-sm"></span>
                    <span 
                      [ngClass]="{
                        'text-emerald-500': user.isActive && !user.isBanned,
                        'text-slate-400': !user.isActive && !user.isBanned,
                        'text-red-500': user.isBanned
                      }"
                      class="text-sm font-bold uppercase tracking-tighter">
                      {{ getStatusLabel(user) }}
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      (click)="onDelete(user)"
                      class="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 transition-all border border-red-500/20 hover:text-white" 
                      title="Supprimer">
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              }

              <!-- Empty State -->
              @if (users.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">group_off</span>
                    <div class="flex flex-col gap-1">
                      <p class="text-slate-900 dark:text-white font-bold text-lg">Aucun utilisateur trouvé</p>
                      <p class="text-slate-500 dark:text-slate-400 text-sm">Essayez d'ajuster vos filtres de recherche</p>
                    </div>
                  </div>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class UsersTableComponent {
  @Input() users: UserTableRow[] = [];
  @Output() delete = new EventEmitter<UserTableRow>();

  getInitials(user: UserTableRow): string {
    if (user.name && user.lastName) {
      return `${user.name[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  }

  getFullName(user: UserTableRow): string {
    if (user.name || user.lastName) {
      return `${user.name || ''} ${user.lastName || ''}`.trim();
    }
    return user.email.split('@')[0];
  }

  getRoleBadgeClass(role: string): string {
    const classes = {
      'ADMIN': 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
      'ORGANIZER': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'CLIENT': 'bg-primary/10 text-primary dark:text-blue-400 border-primary/20'
    };
    return classes[role as keyof typeof classes] || classes.CLIENT;
  }

  getStatusLabel(user: UserTableRow): string {
    if (user.isBanned) return 'Banni';
    if (user.isActive) return 'Actif';
    return 'Inactif';
  }

  onDelete(user: UserTableRow): void {
    this.delete.emit(user);
  }
}
