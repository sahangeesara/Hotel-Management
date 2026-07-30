import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import {ReportService} from "../../../../../services/report.service";

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
  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.incomeRevenueReport().subscribe((res:any)=>{

      this.chartData={
        labels:res.labels,
        datasets:[
          {
            type:'bar',
            label:'Monthly Revenue',
            data:res.revenue,
            backgroundColor:'#36A2EB',
            yAxisID:'y'
          },
          {
            type:'line',
            label:'Growth Rate',
            data:res.growth,
            borderColor:'#FF6384',
            backgroundColor:'#FF6384',
            tension:0.4,
            yAxisID:'y1'
          }
        ]
      };

    });
  }
}
