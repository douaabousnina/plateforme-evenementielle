import { Injectable, signal, computed } from '@angular/core';

@Injectable()
export class TimerService {
    private remainingSeconds = signal<number>(600);
    private intervalId: any = null;

    minutes = computed(() => Math.floor(this.remainingSeconds() / 60));
    seconds = computed(() => this.remainingSeconds() % 60);

    formattedTime = computed(() => {
        const m = this.minutes().toString().padStart(2, '0');
        const s = this.seconds().toString().padStart(2, '0');
        return `${m}:${s}`;
    });

    isExpired = computed(() => this.remainingSeconds() <= 0);

    start(durationInSeconds: number = 600): void {
        this.stop();
        this.remainingSeconds.set(durationInSeconds);

        this.intervalId = setInterval(() => {
            this.remainingSeconds.update(val => {
                if (val <= 0) {
                    this.stop();
                    return 0;
                }
                return val - 1;
            });
        }, 1000);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset(): void {
        this.stop();
        this.remainingSeconds.set(600);
    }
}
