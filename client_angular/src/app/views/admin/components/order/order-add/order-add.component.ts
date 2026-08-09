import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormTextDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {Food} from "../../../../../entities/food";
import {FoodStatus} from "../../../../../entities/foodStatus";
import {ItemCategory} from "../../../../../entities/ItemCategory";
import {Room} from "../../../../../entities/room";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Order} from "../../../../../entities/order";

@Component({
  selector: 'app-order-add',
  standalone: true,
  imports: [
    AlertComponent,
    FormDirective,
    ReactiveFormsModule,
    ColComponent,
    NgForOf,
    NgIf,
    FormLabelDirective,
    FormSelectDirective,
    RowComponent,
    FormControlDirective,
    FormTextDirective,
    NgbInputDatepicker,
    ButtonDirective,
    TableDirective,
    FormsModule
  ],
  templateUrl: './order-add.component.html',
  styleUrl: './order-add.component.scss'
})
export class OrderAddComponent implements OnInit {
  public error: any = null;

  notifications: string[] = [];
  itemCategories: ItemCategory[] = [];
  foods: Food[] = [];
  foodStatus: FoodStatus[] = [];
  foodItems: Food[] = [];
  rooms: Room[] = [];
  customers: any[] = [];
  orderStatus: any[] = [];
  formData = new FormData();
  orderForm: FormGroup;
  totalAmount = 0;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
  ) {
    this.orderForm = this.fb.group({
      id: [''],
      customer_id: ['', [Validators.required]],
      r_id: [''],
      order_date: ['', [Validators.required]],
      order_amount: ['', [Validators.required]],
      order_status_id: ['', [Validators.required]],
      item_category_id: [''],
      food_id: [''],
      quantity: [''],
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

  get roomIdField(): FormControl {
    return this.orderForm.controls['r_id'] as FormControl;
  }
  get itemCateField(): FormControl {
    return this.orderForm.controls['item_category_id'] as FormControl;
  }
  get customerIdField(): FormControl {
    return this.orderForm.controls['customer_id'] as FormControl;
  }
  get foodIdField(): FormControl {
    return this.orderForm.controls['food_id'] as FormControl;
  }
  get orderStatusField(): FormControl {
    return this.orderForm.controls['order_status_id'] as FormControl;
  }

  getRm() {
    this.allServe.getRoom().subscribe({
      next: (response: any) => {
        this.rooms = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  formatDate(obj: any) {
    return obj['year'] + '-' + obj['month'] + '-' + obj['day'];
  }

  getCustomer() {
    this.allServe.getCustomer().subscribe({
      next: (response: any) => {
        this.customers = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getItemCategory() {
    this.allServe.getItemCategory().subscribe({
      next: (response: any) => {
        this.itemCategories = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getFoods(data: any) {
    this.allServe.getFoodByItemCateId(data).subscribe({
      next: (data: any) => {
        this.foods = data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  addSelectedFood() {
    const selectedFoodId = this.orderForm.get('food_id')?.value;
    const quantityRaw = this.orderForm.get('quantity')?.value;
    const quantity = Number(quantityRaw);

    if (!selectedFoodId) {
      this.showAlert('Please select a food item first.', 'warning');
      return;
    }

    if (!quantity || quantity <= 0) {
      this.showAlert('Please enter a valid quantity greater than 0.', 'warning');
      return;
    }

    const food = this.foods.find((f: any) => String(f.id) === String(selectedFoodId));
    if (!food) {
      this.showAlert('Selected food not found in available list.', 'warning');
      return;
    }

    const existing = this.foodItems.find(f => String(f.id) === String(food.id));
    if (existing) {
      // @ts-ignore
      existing.quantity += quantity;
    } else {
      this.foodItems.push({
        ...food,
        quantity: quantity,
      });
    }

    this.orderForm.patchValue({ quantity: '', food_id: '' });
    this.updateTotalAmount();
  }

  getOrderStatus() {
    this.allServe.getOrderStatus().subscribe({
      next: (response: any) => {
        this.orderStatus = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getFoodStatus() {
    this.allServe.getFoodStatus().subscribe({
      next: (response: any) => {
        this.foodStatus = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  updateTotalAmount() {
    this.totalAmount = 0;

    for (let i = 0; i < this.foodItems.length; i++) {
      this.totalAmount += (Number(this.foodItems[i]['food_amount']) || 0) * (Number(this.foodItems[i]['quantity']) || 0);
    }
    this.orderForm.controls['order_amount'].setValue(this.totalAmount + ".00");
  }

  ngOnInit() {
    this.getItemCategory();
    this.getRm();
    this.getCustomer();
    this.getOrderStatus();
    this.getFoodStatus();
  }

  removeFoodItem(index: number, amount: any) {
    let quantity = this.foodItems[index].quantity;
    const foodAmount = Number(amount) || 0;

    // @ts-ignore
    let f_amount = quantity * foodAmount;

    this.foodItems.splice(index, 1);
    this.updateTotalAmount();
    this.orderForm.controls['order_amount'].setValue(this.totalAmount + ".00");
  }

  clearForm() {
    this.foodItems = [];
    this.orderForm.reset();
    this.totalAmount = 0;
    this.orderForm.controls['order_amount'].setValue(this.totalAmount + ".00");
    this.foodIdField.setValue("");
    this.itemCateField.setValue("");
    this.roomIdField.setValue("");
    this.orderStatusField.setValue("");
    this.customerIdField.setValue("");
  }

  onSubmit() {
    if (this.orderForm.valid) {
      let data = (this.orderForm).value;
      let data2 = this.foodItems;
      this.formData = new FormData();

      let order = new Order();
      order.r_id = data.r_id;
      order.customer_id = data.customer_id;
      order.order_date = this.formatDate(data.order_date);
      order.order_amount = data.order_amount;
      order.order_status_id = data.order_status_id;

      this.formData.append('form', JSON.stringify(order));
      this.formData.append('food', JSON.stringify(data2));

      const submissionObservable = from(this.allServe.submitOrder(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            this.clearForm();
            this.notifications.push('Order submitted successfully!');
            this.showAlert('Order submitted successfully!', 'success');
            return data;
          }),
          catchError((error) => {
            this.handleError(error);
            return throwError(error);
          })
        )
        .subscribe();
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.orderForm.markAllAsTouched();
    }
  }

  handleError(error: any) {
    console.error('Backend Error:', error);

    // Safely parse Laravel 10 validation or exception payloads
    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'An unexpected server error occurred.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }
}
