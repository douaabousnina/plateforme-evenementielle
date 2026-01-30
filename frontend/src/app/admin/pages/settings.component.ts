import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="p-8">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Paramètres</h2>
      <p class="text-slate-600 dark:text-slate-400">Paramètres en cours de développement...</p>
    </div>
  `
})
export class SettingsComponent {}
