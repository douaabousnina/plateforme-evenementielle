import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { LocationType } from '../../models/create-event.model';

type LocationTypeValue = LocationType | string;

@Component({
  selector: 'app-event-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  template: `
    <div class="flex flex-col gap-6" [formGroup]="form">
      <h2 class="text-lg font-bold border-b border-border-light dark:border-border-dark pb-2 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">location_on</span>
        Lieu
      </h2>
      
      <!-- Location Type Toggle -->
      <div class="flex gap-4 p-1 bg-background-light dark:bg-[#131022] rounded-lg w-fit border border-border-light dark:border-border-dark">
        <button 
          type="button"
          (click)="selectLocationType('physical')"
          [class.active]="locationType() === 'physical'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-all"
          [ngClass]="locationType() === 'physical' 
            ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' 
            : 'text-text-secondary dark:text-gray-400 hover:text-text-main dark:hover:text-white'">
          Lieu physique
        </button>
        <button 
          type="button"
          (click)="selectLocationType('online')"
          [class.active]="locationType() === 'online'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-all"
          [ngClass]="locationType() === 'online' 
            ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' 
            : 'text-text-secondary dark:text-gray-400 hover:text-text-main dark:hover:text-white'">
          En ligne
        </button>
        <button 
          type="button"
          (click)="selectLocationType('tbd')"
          [class.active]="locationType() === 'tbd'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-all"
          [ngClass]="locationType() === 'tbd' 
            ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' 
            : 'text-text-secondary dark:text-gray-400 hover:text-text-main dark:hover:text-white'">
          À définir
        </button>
      </div>
      
      <!-- Physical Location -->
      <div *ngIf="locationType() === 'physical'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div>
            <app-form-input
              [label]="'Rechercher une adresse'"
              [placeholder]="'Ex: 15 Avenue des Champs-Élysées'"
              [value]="form.get('address')?.value ?? ''"
              [name]="'address'"
              [icon]="'search'"
              (blurred)="onFieldBlur('address', $event)"
            />
          </div>
          
          <div>
            <app-form-input
              [label]="'Nom du lieu (Optionnel)'"
              [placeholder]="'Ex: Salle Pleyel'"
              [value]="form.get('venueName')?.value ?? ''"
              [name]="'venueName'"
              (blurred)="onFieldBlur('venueName', $event)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <app-form-input
                [label]="'Ville'"
                [placeholder]="'Ex: Paris'"
                [value]="form.get('city')?.value ?? ''"
                [name]="'city'"
                (blurred)="onFieldBlur('city', $event)"
              />
            </div>
            
            <div>
              <app-form-input
                [label]="'Pays'"
                [placeholder]="'Ex: France'"
                [value]="form.get('country')?.value ?? ''"
                [name]="'country'"
                (blurred)="onFieldBlur('country', $event)"
              />
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-1">
          <div class="aspect-video w-full rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden relative border border-border-light dark:border-border-dark">
            <div class="bg-center bg-no-repeat w-full h-full bg-cover opacity-70" 
                 style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsjFb9Wuwu5b0Sn0d2h--36IGeySeUR2oHVOzFj08K3T0n8YP_CINPQoVAhGtLJcfPC19PSl6OFirpiplJ4U_sNzKyzxI_EG-zz44eMnJuV-r1hSyTXe1lDuTQ-HFZzksFl1cqmvjlvsuQHULrlUWlr64x5z9vu4zF7Q_Wgz2pirow57ajadmu96e3c4kys-lBBDqR8JQ0gmT48YQHNYa8xgQtb6Rw7tgrtuMn4zYALdHAabpvwU0I74IVPu07-tI-XxqcYC7n3z0');">
            </div>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span class="bg-white dark:bg-surface-dark p-2 rounded-full shadow-md text-primary">
                <span class="material-symbols-outlined">pin_drop</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Online Location -->
      <div *ngIf="locationType() === 'online'" class="flex flex-col gap-4">
        <div>
          <app-form-input
            [label]="'URL de l événement'"
            [placeholder]="'https://zoom.us/...'"
            [type]="'url'"
            [value]="form.get('onlineUrl')?.value ?? ''"
            [name]="'onlineUrl'"
            (blurred)="onFieldBlur('onlineUrl', $event)"
          />
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./event-location.css']
})
export class EventLocationComponent {
  @Input() form!: FormGroup;
  locationType = signal<LocationTypeValue>('physical');
  LocationType = LocationType;

  selectLocationType(type: LocationTypeValue) {
    // Ensure lowercase for backend compatibility
    const lowercaseType = (type as string).toLowerCase();
    this.locationType.set(lowercaseType as LocationTypeValue);
    this.form.patchValue({ locationType: lowercaseType });
  }

  onFieldBlur(controlName: string, value: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
