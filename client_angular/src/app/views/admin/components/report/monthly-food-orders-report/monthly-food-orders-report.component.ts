import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-monthly-food-orders-report',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent],
  templateUrl: './monthly-food-orders-report.component.html',
  styleUrl: './monthly-food-orders-report.component.scss'
})
export class MonthlyFoodOrdersReportComponent implements OnInit {

  chartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Yogurt',
          data: [120, 130, 140, 135, 145, 150, 160, 170, 165, 155, 140, 165],
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
        },
        {
          label: 'Fruit Drinks',
          data: [180, 190, 200, 210, 205, 215, 220, 230, 225, 210, 200, 220],
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
        },
        {
          label: 'Kottu',
          data: [200, 210, 220, 230, 240, 250, 260, 270, 265, 250, 235, 260],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
        },
        {
          label: 'Fried Rice',
          data: [90, 95, 100, 105, 110, 115, 120, 125, 120, 110, 100, 115],
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: 'Desserts',
          data: [50, 55, 60, 65, 70, 75, 80, 85, 80, 70, 65, 75],
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
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
          text: 'Monthly Food Orders by Category'
        }
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Month'
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Orders'
          }
        }
      }
    };
  }
}
