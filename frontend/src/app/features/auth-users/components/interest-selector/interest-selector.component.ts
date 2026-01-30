import { Component, output, input, signal, effect } from '@angular/core';
import { Preference } from '../../models/auth.model';

@Component({
  selector: 'app-interest-selector',
  imports: [],
  templateUrl: './interest-selector.component.html',
  styleUrl: './interest-selector.component.css'
})
export class InterestSelectorComponent {
  preferencesChange = output<Preference[]>(); 
  selectedPreferences = input<Preference[]>([]);
  readonly = input<boolean>(false);

  preferences = signal<Preference[]>([]);

  availablePreferences = [
    { label: 'Cinéma', value: Preference.CINEMA },
    { label: 'Sport', value: Preference.SPORT },
    { label: 'Gastronomie', value: Preference.FOOD },
    { label: 'Technologie', value: Preference.TECH },
    { label: 'Théâtre', value: Preference.THEATRE },
    { label: 'Festivals', value: Preference.FESTIVALS },
    { label: 'Concerts', value: Preference.CONCERTS },
    { label: 'Éducation', value: Preference.EDUCATION },
  ];

  constructor() {
    effect(() => {
      const prefs = this.selectedPreferences() || [];
      this.preferences.set([...prefs]);
    });
  }

  togglePreference(preference: Preference) {
    if (this.readonly()) {
      return;
    }

    const current = [...this.preferences()];
    const index = current.indexOf(preference);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(preference);
    }
    this.preferences.set(current);
    this.preferencesChange.emit(current);
  }

  isSelected(preference: Preference): boolean {
    return this.preferences().includes(preference);
  }
}