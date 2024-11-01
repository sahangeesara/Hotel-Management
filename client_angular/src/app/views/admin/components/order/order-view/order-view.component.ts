import { Component } from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {ButtonDirective, TableDirective} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [
    NgIf,
    ButtonDirective,
    TableDirective,
    IconDirective,
    DatePipe
  ],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.scss'
})
export class OrderViewComponent {
  orderData: any[] = [];

  constructor(
    private allServe: AllServiceService,
    ) {
  }
  orderDelete(id:any){

  }

  ngOnInit() {
    this.getOrder();
  }

  getOrder() {
    this.allServe.getOrders().subscribe(
      (data: any) => {
        this.orderData = data;

      },
      (error) => {
        console.error('Error fetching Food:', error);
      }
    );

  }
}
