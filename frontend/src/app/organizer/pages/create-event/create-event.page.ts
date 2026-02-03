import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { EventFormHeaderComponent } from '../../components/event-form-header/event-form-header.component';
import { EventBasicInfoComponent } from '../../components/event-basic-info/event-basic-info.component';
import { EventDateTimeComponent } from '../../components/event-date-time/event-date-time.component';
import { EventLocationComponent } from '../../components/event-location/event-location.component';
import { EventDescriptionComponent } from '../../components/event-description/event-description.component';
import { EventMediaComponent } from '../../components/event-media/event-media.component';
import { EventTicketingComponent } from '../../components/event-ticketing/event-ticketing.component';
import { EventFormActionsComponent } from '../../components/event-form-actions/event-form-actions.component';

import { EventService } from '../../services/event.service';
import { finalize } from 'rxjs';
import { CreateEventRequest, CreationStep } from '../../models/create-event.model';
import { AuthService } from '../../../features/auth-users/services/auth.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EventFormHeaderComponent,
    EventBasicInfoComponent,
    EventDateTimeComponent,
    EventLocationComponent,
    EventDescriptionComponent,
    EventMediaComponent,
    EventTicketingComponent,
    EventFormActionsComponent
  ],
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.css']
})
export class CreateEventPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentStep: WritableSignal<number> = signal(CreationStep.GENERAL_INFO);
  isSubmitting: WritableSignal<boolean> = signal(false);
  eventForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.eventForm = this.formBuilder.group({
      // Basic info
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      category: ['', Validators.required],

      // Date & Time
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      isRecurring: [false],

      // Location
      locationType: ['physical'], // physical, online, tbd
      address: [''],
      venueName: [''],
      city: [''],
      country: [''],
      onlineUrl: [''],

      // Description
      description: [''],

      // Media
      coverImage: [''],
      gallery: [[]],

      // Capacity & Seating
      totalCapacity: [0, [Validators.required, Validators.min(1)]],
      hasSeatingPlan: [false]
    });
  }

  onCancel() {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les données non enregistrées seront perdues.')) {
      this.router.navigate(['/dashboard/events']);
    }
  }

  onBack() {
    const previousStep = this.currentStep() - 1;
    if (previousStep >= CreationStep.GENERAL_INFO) {
      this.currentStep.set(previousStep);
    }
  }

  onSaveDraft() {
    // TODO: Implement draft saving
    console.log('Save draft:', this.eventForm.value);
  }

  onNext() {
    const step = this.currentStep();

    // Validate current step
    if (!this.validateStep(step)) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Move to next step or submit
    if (step < CreationStep.TICKETING) {
      this.currentStep.set(step + 1);
    } else {
      this.submitForm();
    }
  }

  private validateStep(step: number): boolean {
    const controls = this.eventForm.controls;

    switch (step) {
      case CreationStep.GENERAL_INFO:
        return (
          controls['title'].valid &&
          controls['type'].valid &&
          controls['category'].valid &&
          controls['startDate'].valid &&
          controls['startTime'].valid &&
          controls['endDate'].valid &&
          controls['endTime'].valid
        );
      case CreationStep.TICKETING:
        // Validate capacity is set
        return controls['totalCapacity'].valid && controls['totalCapacity'].value > 0;
      default:
        return false;
    }
  }

  private formatDateToISO(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  }

  private submitForm() {
    if (this.eventForm.invalid) {
      alert('Veuillez vérifier le formulaire.');
      return;
    }

    this.isSubmitting.set(true);
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Utilisateur non authentifié.');
      this.isSubmitting.set(false);
      return;
    }

    const formValue = this.eventForm.value;
    
    // Calculate total capacity from manual input
    const totalCapacity = formValue.totalCapacity || 0;
    
    // Build location object
    const locationTypeMap: Record<string, string> = {
      'PHYSICAL': 'physical',
      'ONLINE': 'online',
      'TBD': 'tbd'
    };

    const location = {
      type: locationTypeMap[formValue.locationType] || formValue.locationType.toLowerCase(),
      address: formValue.address || undefined,
      venueName: formValue.venueName || undefined,
      onlineUrl: formValue.onlineUrl || undefined,
      city: formValue.city || undefined,
      country: formValue.country || undefined
    };

    // Combine date and time into ISO format
    const startDate = formValue.startDate ? new Date(formValue.startDate) : new Date();
    const startTime = formValue.startTime ? new Date(formValue.startTime) : new Date();
    startDate.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
    
    const endDate = formValue.endDate ? new Date(formValue.endDate) : new Date();
    const endTime = formValue.endTime ? new Date(formValue.endTime) : new Date();
    endDate.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());

    // Simple payload - no tickets (seats are created separately)
    const createEventRequest: CreateEventRequest = {
      title: formValue.title,
      description: formValue.description,
      type: formValue.type,
      category: formValue.category,
      startDate: startDate.toISOString(),
      startTime: startDate.toISOString(),
      endDate: endDate.toISOString(),
      endTime: endDate.toISOString(),
      location: location,
      coverImage: formValue.coverImage,
      gallery: formValue.gallery,
      totalCapacity: totalCapacity,
      availableCapacity: totalCapacity,
      hasSeatingPlan: formValue.hasSeatingPlan || false,
      organizerId: String(currentUser.id)
    };

    console.log('Submitting event creation:', createEventRequest);

    this.eventService.createEvent(createEventRequest).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (response: any) => {
        console.log('Event created successfully:', response);
        this.router.navigate(['/dashboard/events']);
      },
      error: (error: any) => {
        console.error('Error creating event:', error);
        console.error('Full error details:', error.error);
        alert('Une erreur est survenue lors de la création de l\'événement.');
      }
    });
  }
}

