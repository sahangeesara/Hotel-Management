import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-payment-collection-report',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent],
  templateUrl: './payment-collection-report.component.html',
  styleUrl: './payment-collection-report.component.scss'
})
export class PaymentCollectionReportComponent implements OnInit {

  barChartData: any;
  barChartOptions: any;
  pieChartData: any;
  pieChartOptions: any;

  ngOnInit(): void {
    // Bar chart for collected vs pending
    this.barChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Completed',
          data: [52000, 42000, 75000, 32000, 90000, 85000, 50000, 45000, 102000, 48000, 52000, 92000],
          backgroundColor: 'rgba(49,140,211,0.8)',
          borderColor: 'rgb(67,80,167)',
          borderWidth: 1
        },
        {
          label: 'Collected',
          data: [42000, 48000, 55000, 52000, 60000, 65000, 70000, 75000, 72000, 68000, 62000, 72000],
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        },
        {
          label: 'Pending',
          data: [3000, 4000, 6000, 6000, 7000, 7000, 8000, 10000, 10000, 7000, 6000, 8000],
          backgroundColor: 'rgba(221,66,85,0.8)',
          borderColor: 'rgb(252,0,0)',
          borderWidth: 1
        }
      ]
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Payment Collection Status by Month'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount ($)'
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

    // Pie chart for payment method breakdown
    this.pieChartData = {
      labels: ['Credit Card', 'Cash', 'Online Payment', 'Bank Transfer', 'Mobile Payment'],
      datasets: [
        {
          data: [320000, 180000, 250000, 150000, 100000],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 206, 86)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }
      ]
    };

    this.pieChartData = {
      labels: ['Collected', 'Pending', 'Completed'],
      datasets: [
        {
          data: [900000, 100000, 850000],
          backgroundColor: [
            '#2EB85C', // Green
            '#F9B115', // Orange
            '#3399FF'  // Blue
          ],
          borderColor: [
            '#2EB85C',
            '#F9B115',
            '#3399FF'
          ],
          borderWidth: 1
        }
      ]
    };

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 14,
            padding: 15
          }
        },
        title: {
          display: true,
          text: 'Payment Collection Summary'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    };}
}
