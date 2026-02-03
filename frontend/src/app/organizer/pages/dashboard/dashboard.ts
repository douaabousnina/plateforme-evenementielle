import { Component, inject, OnInit } from '@angular/core';
import { Alerts } from '../../components/alerts/alerts';
import { EventsTable } from '../../components/events-table/events-table';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { SalesChart } from '../../components/sales-chart/sales-chart';
import { SideBar } from '../../components/side-bar/side-bar';
import { ScanHistoryButton } from '../../components/scan-history-button/scan-history-button';
import { KpiService } from '../../services/kpi.service';
import { SalesService } from '../../services/sales.service';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-dashboard',
  
  imports: [SideBar, KpiCard, SalesChart, EventsTable, Alerts, ScanHistoryButton],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  kpiService = inject(KpiService);
  salesService = inject(SalesService);
  alertsService = inject(AlertsService);
  
  ngOnInit(): void {
    this.kpiService.getKpis().subscribe();
    this.salesService.getSalesData().subscribe();
    this.alertsService.getAlerts().subscribe();
  }
}