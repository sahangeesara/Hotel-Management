import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-income-and-revenue-report',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent],
  templateUrl: './income-and-revenue-report.component.html',
  styleUrl: './income-and-revenue-report.component.scss'
})
export class IncomeAndRevenueReportComponent implements OnInit {

  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          type: 'bar',
          label: 'Monthly Revenue ($)',
          data: [45000, 52000, 61000, 58000, 67000, 72000, 78000, 85000, 82000, 75000, 68000, 80000],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          type: 'line',
            label: 'Growth Rate (%)',
          data: [0, 15.6, 17.3, -4.9, 15.5, 7.5, 8.3, 9.0, -3.5, -8.5, -9.3, 17.6],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Income & Revenue Report with Growth Rate'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue ($)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Growth Rate (%)'
          },
          grid: {
            drawOnChartArea: false
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
