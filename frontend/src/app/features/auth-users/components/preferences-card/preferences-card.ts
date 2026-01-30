import { Component, inject, signal, effect } from '@angular/core';
import { InterestSelectorComponent } from '../interest-selector/interest-selector.component';
import { UserService } from '../../services/user.service';
import { Preference } from '../../models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preferences-card',
  imports: [InterestSelectorComponent, CommonModule],
  templateUrl: './preferences-card.html',
  styleUrl: './preferences-card.css',
})
export class PreferencesCard {
  private userService = inject(UserService);

  isEditing = signal(false);
  selectedPreferences = signal<Preference[]>([]);
  newEventAlerts = signal(true);
  salesActivity = signal(false);

  // Expose service signals
  userProfile = this.userService.userProfile;
  isLoading = this.userService.isLoading;
  error = this.userService.error;

  constructor() {
    // Load preferences from profile
    effect(() => {
      const prefs = this.userProfile()?.preferences || [];
      this.selectedPreferences.set(prefs as Preference[]);
    });
  }

  onPreferencesChange(preferences: Preference[]) {
    this.selectedPreferences.set(preferences);
  }

  onEdit() {
    this.isEditing.set(true);
  }

  cancelEdit() {
    const prefs = this.userProfile()?.preferences || [];
    this.selectedPreferences.set(prefs as Preference[]);
    this.isEditing.set(false);
    this.userService.clearError();
  }

  savePreferences() {
    this.userService.updateProfile({
      preferences: this.selectedPreferences()
    });
    setTimeout(() => {
      if (!this.error()) {
        this.isEditing.set(false);
      }
    }, 300);
  }

  toggleNewEventAlerts() {
    this.newEventAlerts.set(!this.newEventAlerts());
  }

  toggleSalesActivity() {
    this.salesActivity.set(!this.salesActivity());
  }
}
