import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-travel-booking-report',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent],
  templateUrl: './travel-booking-report.component.html',
  styleUrl: './travel-booking-report.component.scss'
})
export class TravelBookingReportComponent implements OnInit {

  lineChartData: any;
  lineChartOptions: any;
  pieChartData: any;
  pieChartOptions: any;

  ngOnInit(): void {
    // Line chart for trend over time
    this.lineChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Cultural & Heritage Tour',
          data: [35, 40, 45, 50, 55, 60, 65, 70, 68, 60, 50, 62],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        },
        {
          label: 'Wildlife & Safari Tour',
          data: [30, 35, 40, 45, 50, 55, 60, 65, 63, 55, 45, 58],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        },
        {
          label: 'Beach & Coastal Tour',
          data: [20, 25, 30, 35, 40, 45, 50, 55, 52, 45, 38, 48],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        },
        {
          label: 'City Sightseeing',
          data: [10, 15, 20, 25, 30, 35, 40, 45,42, 35,28, 38],
          borderColor: 'rgb(11,177,50)',
          backgroundColor: 'rgba(27,252,27,0.7)',
          tension: 0.4
        }
      ]
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Travel Bookings Trend Over Time'
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

    // Pie chart for breakdown by type
    this.pieChartData = {
      labels: ['Wildlife & Safari Tour', 'Cultural & Heritage Tour', 'Beach & Coastal Tour', 'City Sightseeing'],
      datasets: [
        {
          data: [670, 625, 505,400],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(173,227,80,0.8)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(0,249,95)'
          ],
          borderWidth: 1
        }
      ]
    };

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        title: {
          display: true,
          text: 'Travel Bookings by Type'
        }
      }
    };
  }
}
