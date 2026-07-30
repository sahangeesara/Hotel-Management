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

import {ReportService} from "../../../../../services/report.service"; // Update path if needed

@Component({
  selector: 'app-monthly-booking-report',
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
  templateUrl: './monthly-booking-report.component.html',
  styleUrl: './monthly-booking-report.component.scss'
})
export class MonthlyBookingReportComponent implements OnInit {

  chartData: any;
  chartOptions: any;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {

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
          text: 'Monthly Booking Volume Trend'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Bookings'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        }
      }
    };

    this.loadReport();
  }

  loadReport(): void {

    this.reportService.getMonthlyBookingReport().subscribe({
      next: (res: any) => {
        console.log('API Response:', res);

        this.chartData = {
          labels: res.labels,
          datasets: [
            {
              label: 'Total Bookings',
              data: res.totalBookings,
              borderColor: 'rgb(54,162,235)',
              backgroundColor: 'rgba(54,162,235,0.5)',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Cancel Bookings',
              data: res.cancelBookings,
              borderColor: 'red',
              backgroundColor: 'rgba(255,0,0,0.5)',
              fill: false,
              tension: 0.4
            }
          ]
        };

        console.log(this.chartData);
      },
      error: (err: any) => console.error(err)
    });
  }

}
