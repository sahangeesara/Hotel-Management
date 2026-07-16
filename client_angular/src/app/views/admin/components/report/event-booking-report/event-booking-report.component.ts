import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

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

  ngOnInit(): void {
    this.chartData = {
      labels: ['Wedding', 'Conference', 'Birthday Party', 'Charity Event', 'Seminar', 'Gala Dinner', 'Exhibition', 'Workshop'],
      datasets: [
        {
          label: 'Number of Bookings',
          data: [45, 89, 62, 78, 52, 38, 43, 56],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(201, 203, 207, 0.8)',
            'rgba(100, 181, 246, 0.8)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(201, 203, 207)',
            'rgb(100, 181, 246)'
          ],
          borderWidth: 1
        }
      ]
    };

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
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Bookings'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Event Type'
          }
        }
      }
    };
  }
}
