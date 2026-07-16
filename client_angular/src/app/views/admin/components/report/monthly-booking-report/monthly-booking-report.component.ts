import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-monthly-booking-report',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent],
  templateUrl: './monthly-booking-report.component.html',
  styleUrl: './monthly-booking-report.component.scss'
})
export class MonthlyBookingReportComponent implements OnInit {

  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Total Bookings',
          data: [145, 154, 195, 209, 188, 190, 208, 240, 242, 209, 185, 226],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.4
        } ,
        {
          label: 'Cancel Bookings',
          data: [10, 15, 19, 20, 18, 17, 21, 24, 8, 9, 5, 6],
          borderColor: 'rgb(246,3,3)',
          backgroundColor: 'rgba(251,3,3,0.5)',
          tension: 0.4
        }
      ]
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
  }
}
