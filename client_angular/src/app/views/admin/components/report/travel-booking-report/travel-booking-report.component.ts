import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import {ReportService} from "../../../../../services/report.service";

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

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {

    this.loadTravelTrend();

    this.loadVehicleChart();

  }

  loadTravelTrend() {

    this.reportService.travelBookingTrendReport()
      .subscribe((res: any) => {

        this.lineChartData = {
          labels: res.labels,
          datasets: res.datasets
        };

      });

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
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

  }


  loadVehicleChart() {

    this.reportService.transportVehicleReport()
      .subscribe((res: any) => {

        this.pieChartData = {
          labels: res.labels,
          datasets: [
            {
              data: res.data,
              backgroundColor: [
                '#36A2EB',
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#9966FF',
                '#FF9F40',
                '#8BC34A',
                '#795548'
              ]
            }
          ]
        };

      });

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Transport Bookings by Vehicle Type'
        }
      }
    };
  }
}
