import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import {ReportService} from "../../../../../services/report.service";

@Component({
  selector: 'app-event-booking-report',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent],
  templateUrl: './event-booking-report.component.html',
  styleUrl: './event-booking-report.component.scss'
})
export class EventBookingReportComponent implements OnInit {

  chartData: any;
  chartOptions: any;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart() {

    this.reportService.eventBookingReport().subscribe((res: any) => {

      this.chartData = {
        labels: res.labels,
        datasets: [
          {
            label: 'Number of Bookings',
            data: res.data,
            backgroundColor: [
              'rgba(255,99,132,0.8)',
              'rgba(54,162,235,0.8)',
              'rgba(75,192,192,0.8)'
            ],
            borderWidth: 1
          }
        ]
      };

    });

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Event Bookings by Type'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

  }

}
