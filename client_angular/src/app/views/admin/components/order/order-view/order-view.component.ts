import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ButtonDirective, FormSelectDirective, TableDirective} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";
import { IconDirective } from '@coreui/icons-angular';
import {FormsModule} from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [
    NgIf,
    ButtonDirective,
    TableDirective,
    IconDirective,
    DatePipe,
    FormSelectDirective,
    FormsModule,
    NgForOf
  ],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.scss'
})
export class OrderViewComponent implements OnInit    {
  orderData: any[] = [];
  orderStatusList: any[] = [];
  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(
    private allServe: AllServiceService,
  ) {
  }

  orderDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this order deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allServe.deleteOrders(id).subscribe({
          next: (data: any) => {
            this.getOrder();
            this.showAlert('Order deleted successfully!', 'success');
          },
          error: (error) => {
            console.error('Error fetching employee:', error);
            this.showAlert('Failed to delete order.', 'danger');
          }
        });
      }
    });
  }

  ngOnInit() {
    this.getOrder();
    this.getOrderStatus();
  }

  getOrder() {
    this.allServe.getOrders().subscribe({
      next: (data: any) => {
        this.orderData = data;
      },
      error: (error) => {
        console.error('Error fetching Food:', error);
        this.showAlert('Failed to load orders.', 'danger');
      }
    });
  }

  getOrderStatus() {
    this.allServe.getOrderStatus().subscribe({
      next: (response: any) => {
        this.orderStatusList = response.data;
      },
      error: (error) => {
        console.error('Error fetching Food:', error);
        this.showAlert('Failed to load order statuses.', 'danger');
      }
    });
  }

  showAlert(message: string, color: string = 'success') {
    this.alertMessage = message;
    this.alertColor = color;
    setTimeout(() => {
      this.clearAlert();
    }, 4000);
  }

  clearAlert() {
    this.alertMessage = '';
  }

  onOrderStatusChange(order: any) {
    const selectedStatus = this.orderStatusList.find(s => s.id == order.order_status_id);
    const isCancelled = selectedStatus && selectedStatus.name.toLowerCase() === 'cancelled';

    Swal.fire({
      title: 'Update Order Status?',
      text: `Do you want to change the status of order "${order.order_no || order.id}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          order_status_id: order.order_status_id,
          is_active: isCancelled ? 0 : 1
        };

        this.allServe.updateOrdersStatus(payload, order.id).subscribe({
          next: (response: any) => {
            this.showAlert(`Order status updated successfully for ${order.order_no || order.id}`, 'success');
            this.getOrder();
          },
          error: (error) => {
            console.error('Error updating order status:', error);
            this.showAlert('Failed to update order status.', 'danger');
            this.getOrder();
          }
        });
      } else {
        this.getOrder(); // Revert selection if cancelled
      }
    });
  }
}
