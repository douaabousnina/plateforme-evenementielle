import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  imports: [CommonModule],
  template: `
    <header class="p-8 pb-4">
      <div class="flex flex-wrap justify-between items-end gap-6">
        <div class="flex flex-col gap-2">
          <nav class="flex text-xs font-bold text-slate-400 gap-2 mb-1 uppercase tracking-widest">
            <span>{{ breadcrumb }}</span>
            @if (subBreadcrumb) {
            <span>/</span>
            <span class="text-accent-violet">{{ subBreadcrumb }}</span>
            }
          </nav>
          <h2 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">{{ title }}</h2>
          <p class="text-slate-500 dark:text-slate-400 text-base font-medium">
            {{ description }}
            @if (apiEndpoint) {
            <code class="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-accent-violet font-mono text-sm">{{ apiEndpoint }}</code>
            }
          </p>
        </div>
        @if (showAction) {
        <button
          (click)="actionClick.emit()"
          class="flex items-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-lg">{{ actionIcon }}</span>
          <span class="truncate">{{ actionLabel }}</span>
        </button>
        }
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class PageHeaderComponent {
  @Input() breadcrumb = 'Admin';
  @Input() subBreadcrumb = '';
  @Input() title = '';
  @Input() description = '';
  @Input() apiEndpoint = '';
  @Input() showAction = false;
  @Input() actionLabel = 'Action';
  @Input() actionIcon = 'add';
  @Output() actionClick = new EventEmitter<void>();
}
