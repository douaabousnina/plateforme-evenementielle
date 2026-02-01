import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth-users/services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-72 bg-primary text-white flex flex-col min-h-screen sticky top-0 border-r border-white/10">
      <div class="p-6">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-3 mb-10">
          <div class="bg-accent-violet rounded-xl p-2 shadow-lg shadow-accent-violet/20">
            <span class="material-symbols-outlined text-white text-3xl">event_available</span>
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl font-extrabold tracking-tight">EventAdmin</h1>
            <p class="text-white/60 text-xs font-medium uppercase tracking-wider leading-none mt-1">Système de Gestion</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col gap-2">
          <a 
            routerLink="/admin/dashboard" 
            routerLinkActive="bg-accent-violet/30 text-white shadow-sm ring-1 ring-white/20"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <span class="material-symbols-outlined text-white/70 group-hover:text-white">dashboard</span>
            <span class="text-sm font-semibold">Tableau de bord</span>
          </a>

          <a 
            routerLink="/admin/users" 
            routerLinkActive="bg-accent-violet/30 text-white shadow-sm ring-1 ring-white/20"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <span class="material-symbols-outlined" [class.filled-icon]="isUsersActive">group</span>
            <span class="text-sm font-semibold">Utilisateurs</span>
          </a>

          <a 
            routerLink="/admin/events" 
            routerLinkActive="bg-accent-violet/30 text-white shadow-sm ring-1 ring-white/20"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <span class="material-symbols-outlined text-white/70 group-hover:text-white">calendar_month</span>
            <span class="text-sm font-semibold">Événements</span>
          </a>

          <a 
            routerLink="/admin/reports" 
            routerLinkActive="bg-accent-violet/30 text-white shadow-sm ring-1 ring-white/20"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <span class="material-symbols-outlined text-white/70 group-hover:text-white">analytics</span>
            <span class="text-sm font-semibold">Rapports API</span>
          </a>

          <a 
            routerLink="/admin/settings" 
            routerLinkActive="bg-accent-violet/30 text-white shadow-sm ring-1 ring-white/20"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group">
            <span class="material-symbols-outlined text-white/70 group-hover:text-white">settings</span>
            <span class="text-sm font-semibold">Paramètres</span>
          </a>
        </nav>
      </div>

      <!-- User Profile & Logout -->
      <div class="mt-auto p-6 border-t border-white/10">
        <div class="flex items-center gap-3 mb-6 p-2 rounded-lg bg-black/20">
          <div class="size-10 rounded-full border-2 border-accent-violet bg-slate-600"></div>
          <div class="flex flex-col">
            <span class="text-xs font-bold truncate">{{ adminName }}</span>
            <span class="text-[10px] text-white/50 uppercase font-black">{{ adminRole }}</span>
          </div>
        </div>
        <button 
          (click)="logout()"
          class="flex w-full items-center justify-center gap-2 rounded-lg h-11 px-4 bg-accent-violet/10 hover:bg-accent-violet/20 text-accent-violet text-sm font-bold transition-all border border-accent-violet/20">
          <span class="material-symbols-outlined text-sm">logout</span>
          <span class="truncate">Se déconnecter</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class AdminSidebarComponent {
  private authService = inject(AuthService);
  
  adminName = 'Admin EventLife';
  adminRole = 'ADMIN';
  isUsersActive = false;

  logout(): void {
    this.authService.logout();
  }
}
