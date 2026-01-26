import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrls: ['./kpi-card.css'],
})
export class KpiCard {
  @Input() title = 'Title';
  @Input() value: string | number = '0';
  @Input() icon = 'payments';
  @Input() trendIcon = 'trending_up';
  @Input() trend = '+0%';
  @Input() sub = 'vs période';
}


