import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessService } from '../../services/access.service';
import { ScanLog } from '../../models/access.model';
import { ScanStatsSummaryComponent } from '../scan-stats-summary/scan-stats-summary.component';
import { EventStatsCardComponent, EventStats } from '../event-stats-card/event-stats-card.component';
import { ScanDetailsTableComponent } from '../scan-details-table/scan-details-table.component';

interface EventStatsWithScans extends EventStats {
  scans: ScanLog[];
}

@Component({
  selector: 'app-scan-history',
  standalone: true,
  imports: [CommonModule, ScanStatsSummaryComponent, EventStatsCardComponent, ScanDetailsTableComponent],
  templateUrl: './scan-history.component.html',
  styleUrls: ['./scan-history.component.css']
})
export class ScanHistoryComponent implements OnInit {
  eventStats: EventStatsWithScans[] = [];
  allScans: ScanLog[] = [];
  loading = true;
  selectedEventId: string | null = null;

  constructor(private readonly accessService: AccessService) {}

  ngOnInit(): void {
    this.loadScanHistory();
  }

  loadScanHistory(): void {
    this.loading = true;
    this.accessService.getAllScanHistory().subscribe({
      next: (scans) => {
        this.allScans = scans.map(scan => ({
          ...scan,
          scannedAt: new Date(scan.scannedAt),
          timestamp: new Date(scan.timestamp)
        }));
        this.calculateEventStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading scan history:', error);
        this.loading = false;
      }
    });
  }

  calculateEventStats(): void {
    const eventMap = new Map<string, ScanLog[]>();
    
    this.allScans.forEach(scan => {
      const eventId = scan.eventId || 'unknown';
      if (!eventMap.has(eventId)) {
        eventMap.set(eventId, []);
      }
      eventMap.get(eventId)!.push(scan);
    });

    this.eventStats = Array.from(eventMap.entries()).map(([eventId, scans]) => {
      const sortedScans = scans.sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime());
      const uniqueTickets = new Set(scans.map(s => s.ticketId));
      
      return {
        eventId,
        eventName: scans[0].eventName || `Event ${eventId}`,
        totalScans: scans.length,
        uniqueScans: uniqueTickets.size,
        duplicateScans: scans.length - uniqueTickets.size,
        lastScan: sortedScans[0]?.scannedAt || null,
        scans: sortedScans
      };
    }).sort((a, b) => {
      if (!a.lastScan) return 1;
      if (!b.lastScan) return -1;
      return b.lastScan.getTime() - a.lastScan.getTime();
    });
  }

  toggleEvent(eventId: string): void {
    this.selectedEventId = this.selectedEventId === eventId ? null : eventId;
  }

  isEventExpanded(eventId: string): boolean {
    return this.selectedEventId === eventId;
  }

  getTotalUniqueTickets(): number {
    return this.eventStats.reduce((sum, e) => sum + e.uniqueScans, 0);
  }
}
