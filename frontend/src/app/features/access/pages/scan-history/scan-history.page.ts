import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessService } from '../../services/access.service';
import { ScanLog } from '../../models/access.model';
import { ScanStatsSummaryComponent } from '../../components/scan-stats-summary/scan-stats-summary.component';
import { EventStatsCardComponent, EventStats } from '../../components/event-stats-card/event-stats-card.component';
import { ScanDetailsTableComponent } from '../../components/scan-details-table/scan-details-table.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

interface EventStatsWithScans extends EventStats {
  scans: ScanLog[];
}

@Component({
  selector: 'app-scan-history',
  standalone: true,
  imports: [CommonModule, ScanStatsSummaryComponent, EventStatsCardComponent, ScanDetailsTableComponent, HeaderComponent],
  templateUrl: './scan-history.page.html',
  styleUrls: ['./scan-history.page.css']
})
export class ScanHistoryComponent implements OnInit {
  eventStats: EventStatsWithScans[] = [];
  loading = true;
  selectedEventId: string | null = null;

  constructor(private readonly accessService: AccessService) {}

  ngOnInit(): void {
    this.loadScanHistory();
  }

  loadScanHistory(): void {
    this.loading = true;
    // Use backend stats endpoint instead of calculating manually
    this.accessService.getAllEventStats().subscribe({
      next: (stats) => {
        // Convert dates and map to component format
        this.eventStats = stats.map((stat: any) => ({
          eventId: stat.eventId,
          eventName: stat.eventName,
          totalScans: stat.total,
          uniqueScans: stat.uniqueTickets,
          duplicateScans: stat.total - stat.uniqueTickets,
          lastScan: stat.lastScan ? new Date(stat.lastScan) : null,
          scans: [] // Will be loaded on demand when event is expanded
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading scan statistics:', error);
        this.loading = false;
      }
    });
  }

  loadEventScans(eventId: string): void {
    // Load detailed scans for a specific event when expanded
    const event = this.eventStats.find(e => e.eventId === eventId);
    if (event && event.scans.length === 0) {
      this.accessService.getScanHistory(eventId).subscribe({
        next: (scans: ScanLog[]) => {
          event.scans = scans.map((scan: any) => ({
            ...scan,
            scannedAt: new Date(scan.scannedAt),
            timestamp: new Date(scan.timestamp)
          })).sort((a: any, b: any) => b.scannedAt.getTime() - a.scannedAt.getTime());
        },
        error: (error: any) => {
          console.error('Error loading event scans:', error);
        }
      });
    }
  }

  toggleEvent(eventId: string): void {
    const wasExpanded = this.selectedEventId === eventId;
    this.selectedEventId = wasExpanded ? null : eventId;
    
    // Load scans when expanding an event
    if (!wasExpanded) {
      this.loadEventScans(eventId);
    }
  }

  isEventExpanded(eventId: string): boolean {
    return this.selectedEventId === eventId;
  }

  getTotalUniqueTickets(): number {
    return this.eventStats.reduce((sum, e) => sum + e.uniqueScans, 0);
  }

  getTotalScans(): number {
    return this.eventStats.reduce((sum, e) => sum + e.totalScans, 0);
  }
}
