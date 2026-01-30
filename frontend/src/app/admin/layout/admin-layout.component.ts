import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',

  imports: [CommonModule, RouterOutlet, AdminSidebarComponent],
  template: `
    <div class="min-h-screen flex bg-background-light dark:bg-background-dark">
      <app-admin-sidebar></app-admin-sidebar>
      <main class="flex-1 flex flex-col">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class AdminLayoutComponent {}
