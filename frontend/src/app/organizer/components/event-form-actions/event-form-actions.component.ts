import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0a0814] border-t border-border-light dark:border-border-dark px-4 py-4 md:px-6 md:py-6 flex justify-between items-center gap-3">
      <!-- Left section: Cancel button -->
      <button
        type="button"
        (click)="onCancel()"
        [disabled]="disabled"
        class="px-4 py-2 border border-border-light dark:border-border-dark text-text-main dark:text-gray-200 rounded-lg font-medium hover:bg-background-light dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        Annuler
      </button>

      <!-- Right section: Save Draft, Back and Next buttons -->
      <div class="flex gap-3 items-center">
        @if (showBack) {
          <button
            type="button"
            (click)="onBack()"
            [disabled]="disabled"
            class="px-4 py-2 border border-border-light dark:border-border-dark text-text-main dark:text-gray-200 rounded-lg font-medium hover:bg-background-light dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Retour
          </button>
        }

        <button
          type="button"
          (click)="onSaveDraft()"
          [disabled]="disabled"
          class="hidden md:inline-flex px-4 py-2 border border-primary text-primary dark:text-primary rounded-lg font-medium hover:bg-primary/5 dark:hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Enregistrer le brouillon
        </button>

        <button
          type="button"
          (click)="onNext()"
          [disabled]="disabled"
          class="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          Suivant
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./event-form-actions.css']
})
export class EventFormActionsComponent {
  @Input() disabled = false;
  @Input() showBack = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() saveDraft = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onBack() {
    this.back.emit();
  }

  onSaveDraft() {
    this.saveDraft.emit();
  }

  onNext() {
    this.next.emit();
  }
}
