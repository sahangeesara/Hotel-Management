import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import {ReportService} from "../../../../../services/report.service";

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

  constructor(private reportService: ReportService) {
  }

  ngOnInit(): void {
    // Pie chart for payment method breakdown

    this.reportService.paymentCollectionReport().subscribe((res:any)=>{

      this.pieChartData={
        labels:['Completed','Pending'],
        datasets:[
          {
            data:[
              res.completedTotal,
              res.pendingTotal
            ],
            backgroundColor:[
              '#2EB85C',
              '#F9B115'
            ]
          }
        ]
      };

    });

    // Bar chart for collected vs pending
    this.reportService.paymentCollectionReport().subscribe((res: any) => {

      this.barChartData = {
        labels: res.labels,
        datasets: [
          {
            label: 'Completed',
            data: res.completed,
            backgroundColor: '#36A2EB'
          },
          {
            label: 'Pending',
            data: res.pending,
            backgroundColor: '#FF6384'
          }
        ]
      };

    });
  }
}
