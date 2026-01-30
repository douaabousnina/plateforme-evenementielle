import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
    imports: [CommonModule, FormsModule],
  template: `
    <section class="px-8 py-4">
      <div class="bg-white dark:bg-surface-dark p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-accent-violet transition-colors">
            <span class="material-symbols-outlined">search</span>
          </div>
          <input 
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            class="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-background-dark/50 border-none rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-accent-violet transition-all font-medium" 
            [placeholder]="placeholder"
            type="text"/>
          <div class="absolute inset-y-0 right-4 flex items-center">
            <kbd class="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
              <span class="text-lg">⌘</span> K
            </kbd>
          </div>
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
export class SearchBarComponent {
  @Input() placeholder = 'Rechercher...';
  @Output() search = new EventEmitter<string>();
  
  searchQuery = '';

  onSearchChange(query: string): void {
    this.search.emit(query);
  }
}
