import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { EventType, EventCategory } from '../../models/create-event.model';

@Component({
  selector: 'app-event-basic-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  template: `
    <div class="flex flex-col gap-6" [formGroup]="form">
      <h2 class="text-lg font-bold border-b border-border-light dark:border-border-dark pb-2 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">info</span>
        Détails de base
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Title -->
        <div class="md:col-span-2">
          <app-form-input
            [label]="'Titre de l événement'"            
            [placeholder]="'Soyez clair et descriptif (ex: Conférence Tech 2024)'"
            [value]="form.get('title')?.value ?? ''"
            [name]="'title'"
            (blurred)="onFieldBlur('title', $event)"
          />
        </div>
        
        <!-- Type -->
        <div>
          <label class="block text-sm font-medium mb-2 text-text-main dark:text-gray-200">
            Type d'événement
          </label>
          <select 
            formControlName="type"
            class="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-[#131022] text-text-main dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Sélectionner...</option>
            <option *ngFor="let type of eventTypes" [value]="type">{{ formatEnum(type) }}</option>
          </select>
        </div>
        
        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-2 text-text-main dark:text-gray-200">
            Catégorie
          </label>
          <select 
            formControlName="category"
            class="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-[#131022] text-text-main dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Sélectionner...</option>
            <option *ngFor="let category of categories" [value]="category">{{ formatEnum(category) }}</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./event-basic-info.css']
})
export class EventBasicInfoComponent {
  @Input() form!: FormGroup;

  eventTypes = Object.values(EventType);
  categories = Object.values(EventCategory);

  onFieldBlur(controlName: string, value: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  formatEnum(value: string): string {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

