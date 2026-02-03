import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-chart',
  
  imports: [CommonModule],
  templateUrl: './sales-chart.html',
  styleUrls: ['./sales-chart.css'],
})
export class SalesChart implements OnInit {
  salesService = inject(SalesService);

  ngOnInit() {
    this.salesService.getSalesData().subscribe();
  }

  calculateYPosition(amount: number, maxAmount: number = 6200): number {
    // SVG viewBox height is 300, data area is 250 (50 to 300)
    const normalizedAmount = (amount / maxAmount) * 250;
    return 300 - normalizedAmount;
  }

  generatePathData(): string {
    const data = this.salesService.salesData()?.data || [];
    if (data.length === 0) return '';
    
    const maxAmount = Math.max(...data.map(d => d.amount));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 1000;
      const y = this.calculateYPosition(d.amount, maxAmount) * 0.8 + 50; // Scale and offset
      return `${x},${y}`;
    }).join(' ');
    
    return `M${points}`;
  }

  generateCircles(): Array<{x: number, y: number}> {
    const data = this.salesService.salesData()?.data || [];
    if (data.length === 0) return [];
    
    const maxAmount = Math.max(...data.map(d => d.amount));
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * 1000,
      y: this.calculateYPosition(d.amount, maxAmount) * 0.8 + 50
    }));
  }
}
