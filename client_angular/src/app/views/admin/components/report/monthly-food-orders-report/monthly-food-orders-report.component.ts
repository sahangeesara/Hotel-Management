import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-monthly-food-orders-report',
  standalone: true,
  imports: [
    CommonModule,
    ChartjsComponent,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent
  ],
  templateUrl: './monthly-food-orders-report.component.html',
  styleUrl: './monthly-food-orders-report.component.scss'
})
export class MonthlyFoodOrdersReportComponent implements OnInit {

  chartData: any = {};      // <-- Must exist
  chartOptions: any = {};   // <-- Must exist

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    this.reportService.ordersReport().subscribe((res: any) => {

      this.chartData = {
        labels: res.labels,
        datasets: res.datasets
      };

      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Monthly Food Orders by Category'
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      };
    });
  }
}
