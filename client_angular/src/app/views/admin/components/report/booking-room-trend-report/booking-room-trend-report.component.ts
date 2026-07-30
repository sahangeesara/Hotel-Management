import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import {ReportService} from "../../../../../services/report.service";

@Component({
  selector: 'app-booking-room-trend-report',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent],
  templateUrl: './booking-room-trend-report.component.html',
  styleUrl: './booking-room-trend-report.component.scss'
})
export class BookingRoomTrendReportComponent implements OnInit {

  chartData: any;
  chartOptions: any;
  constructor(
    private reportService: ReportService
  ){}

  ngOnInit(): void {

    this.loadBookingTrend();

  }


  loadBookingTrend(){

    this.reportService.bookingTrendReport()
      .subscribe(res=>{


        this.chartData = {

          labels:res.labels,

          datasets:res.datasets.map((item:any)=>({

            label:item.label,

            data:item.data,

            tension:0.4,

            fill:false

          }))

        };


      });


    this.chartOptions={

      responsive:true,

      maintainAspectRatio:false,

      plugins:{

        legend:{
          position:'top'
        },

        title:{
          display:true,
          text:'Booking Trends by Room Type'
        }

      },


      scales:{

        y:{
          beginAtZero:true,
          title:{
            display:true,
            text:'Number of Bookings'
          }
        },

        x:{
          title:{
            display:true,
            text:'Month'
          }
        }

      }

    };

  }
}
