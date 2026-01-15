import { Component, inject, effect } from '@angular/core';
import { TimerService } from '../../../core/services/timer.service';

@Component({
    selector: 'app-timer',
    standalone: true,
    templateUrl: './timer.component.html',
})
export class TimerComponent {
    timerService = inject(TimerService);

    constructor() {
        effect(() => {
            if (this.timerService.isExpired()) {
                console.warn('Réservation expirée');
                //TODO: ...
            }
        });
    }
}