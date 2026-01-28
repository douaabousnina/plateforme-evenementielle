import { Component, inject, OnInit } from '@angular/core';
import { Alerts } from '../../components/alerts/alerts';
import { EventsTable } from '../../components/events-table/events-table';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { SalesChart } from '../../components/sales-chart/sales-chart';
import { SideBar } from '../../components/side-bar/side-bar';
import { KpiService } from '../../services/kpi.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideBar, KpiCard, SalesChart, EventsTable, Alerts],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  kpiService = inject(KpiService);
  
  ngOnInit(): void {
    this.kpiService.getKpis().subscribe();
  }
}