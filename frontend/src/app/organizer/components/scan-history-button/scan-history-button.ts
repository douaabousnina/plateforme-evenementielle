import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-history-button',
  standalone: true,
  imports: [],
  templateUrl: './scan-history-button.html',
  styleUrls: ['./scan-history-button.css']
})
export class ScanHistoryButton {
  constructor(private router: Router) {}

  navigateToScanHistory() {
    this.router.navigate(['/scan-history']);
  }
}
