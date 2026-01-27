import { Component, inject } from '@angular/core';
import { TimerService } from '../../../../core/services/timer.service';

@Component({
    selector: 'app-timer',
    standalone: true,
    templateUrl: './timer.component.html',
})
export class TimerComponent {
    timerService = inject(TimerService);
}