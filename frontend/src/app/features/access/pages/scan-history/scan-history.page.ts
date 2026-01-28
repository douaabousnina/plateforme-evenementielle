import { Component, signal, effect, inject } from '@angular/core';
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
  imports: [
    CommonModule,
    ScanStatsSummaryComponent,
    EventStatsCardComponent,
    ScanDetailsTableComponent,
    HeaderComponent
  ],
  templateUrl: './scan-history.page.html',
  styleUrls: ['./scan-history.page.css']
})
export class ScanHistoryComponent {
  private readonly accessService = inject(AccessService);

  eventStats = signal<EventStatsWithScans[]>([]);
  loading = signal<boolean>(false);
  selectedEventId = signal<string | null>(null);

  constructor() {
    // Load scan history on component initialization
    this.loadScanHistory();
  }

  loadScanHistory(): void {
    this.loading.set(true);
    
    this.accessService.getAllEventStats().subscribe({
      next: (stats) => {
        const mappedStats = stats.map((stat: any) => ({
          eventId: stat.eventId,
          eventName: stat.eventName,
          totalScans: stat.total,
          uniqueScans: stat.uniqueTickets,
          duplicateScans: stat.total - stat.uniqueTickets,
          lastScan: stat.lastScan ? new Date(stat.lastScan) : null,
          scans: []
        }));
        
        this.eventStats.set(mappedStats);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading scan statistics:', error);
        this.loading.set(false);
      }
    });
  }

  loadEventScans(eventId: string): void {
    const currentStats = this.eventStats();
    const event = currentStats.find(e => e.eventId === eventId);
    
    console.log(`Loading scans for event ${eventId}`);
    
    if (event && event.scans.length === 0) {
      this.accessService.getScanHistory(eventId).subscribe({
        next: (scans: ScanLog[]) => {
          const sortedScans = scans
            .map((scan: any) => ({
              ...scan,
              scannedAt: new Date(scan.scannedAt),
              timestamp: new Date(scan.timestamp)
            }))
            .sort((a: any, b: any) => b.scannedAt.getTime() - a.scannedAt.getTime());

          // Update the specific event with scans
          const updatedStats = currentStats.map(e => 
            e.eventId === eventId ? { ...e, scans: sortedScans } : e
          );
          
          this.eventStats.set(updatedStats);
          console.log(`Loaded ${sortedScans.length} scans for event ${eventId}`);
        },
        error: (error: any) => {
          console.error('Error loading event scans:', error);
        }
      });
    }
  }

  toggleEvent(eventId: string): void {
    const currentSelectedId = this.selectedEventId();
    const wasExpanded = currentSelectedId === eventId;
    
    this.selectedEventId.set(wasExpanded ? null : eventId);
    
    // Load scans when expanding an event
    if (!wasExpanded) {
      this.loadEventScans(eventId);
    }
  }

  isEventExpanded(eventId: string): boolean {
    return this.selectedEventId() === eventId;
  }

  getTotalUniqueTickets(): number {
    return this.eventStats().reduce((sum, e) => sum + e.uniqueScans, 0);
  }

  getTotalScans(): number {
    return this.eventStats().reduce((sum, e) => sum + e.totalScans, 0);
  }
}