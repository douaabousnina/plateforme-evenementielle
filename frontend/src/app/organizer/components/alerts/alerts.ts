import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css'],
})
export class Alerts implements OnInit {
  alertsService = inject(AlertsService);

  ngOnInit() {
    this.alertsService.getAlerts().subscribe();
  }

  getAlertBgColor(type: string): string {
    const colors: Record<string, string> = {
      'warning': 'bg-yellow-50 dark:bg-yellow-900/20',
      'success': 'bg-green-50 dark:bg-green-900/20',
      'error': 'bg-red-50 dark:bg-red-900/20',
      'info': 'bg-blue-50 dark:bg-blue-900/20'
    };
    return colors[type] || 'bg-slate-50 dark:bg-slate-900/20';
  }

  getAlertBorderColor(type: string): string {
    const colors: Record<string, string> = {
      'warning': 'border-l-yellow-500',
      'success': 'border-l-green-500',
      'error': 'border-l-red-500',
      'info': 'border-l-blue-500'
    };
    return colors[type] || 'border-l-slate-500';
  }

  getAlertTextColor(type: string): string {
    const colors: Record<string, string> = {
      'warning': 'text-yellow-800 dark:text-yellow-200',
      'success': 'text-green-800 dark:text-green-200',
      'error': 'text-red-800 dark:text-red-200',
      'info': 'text-blue-800 dark:text-blue-200'
    };
    return colors[type] || 'text-slate-800 dark:text-slate-200';
  }
}

