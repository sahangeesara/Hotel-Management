import {DatePipe, DecimalPipe, DOCUMENT, NgStyle} from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {

  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
    ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { WidgetsDropdownComponent } from '../../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import {DashboardService} from "../../../services/dashboard.service";


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [WidgetsDropdownComponent, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressComponent, DatePipe, DecimalPipe]
})
export class DashboardComponent implements OnInit {

  readonly dashboardService = inject(DashboardService);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  today = new Date();

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  income = {
    room: 0,
    transport: 0,
    hotel: 0,
    wedding: 0,
    restaurant: 0,
    roomPercent: 0,
    transportPercent: 0,
    hotelPercent: 0,
    weddingPercent: 0,
    restaurantPercent: 0,
    totalIncome: 0
  };


  ngOnInit(): void {
    this.loadBookingChart();
    this.loadBookingIncome();
  }

  loadBookingIncome(): void {
    this.dashboardService.getBookingIncome().subscribe({
      next: (res: any) => {
        this.income = res;
      },
      error: (err) => {
        console.error('Booking income error', err);
      }
    });
  }  loadBookingChart(type: string = 'Month') {

    this.dashboardService.getBookingChart(type).subscribe(res => {

      this.mainChart.data = {
        labels: res.labels,
        datasets: [
          {
            label: 'Room Booking',
            data: res.datasets[0].data,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13,110,253,.15)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Transport Booking',
            data: res.datasets[1].data,
            borderColor: '#198754',
            backgroundColor: 'rgba(25,135,84,.15)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Hotel Event',
            data: res.datasets[2].data,
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255,193,7,.15)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Wedding Event',
            data: res.datasets[3].data,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220,53,69,.15)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Restaurant Event',
            data: res.datasets[4].data,
            borderColor: '#6f42c1',
            backgroundColor: 'rgba(111,66,193,.15)',
            fill: false,
            tension: 0.4
          }
        ]
      };

      this.mainChartRef()?.update();
    });
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.patchValue({
      trafficRadio: value
    });

    this.loadBookingChart(value);
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.loadBookingChart();
    }
  }



  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }


}
