import {Component, OnInit} from '@angular/core';
import {
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
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {Food} from "../../../../../entities/food";
import {FoodStatus} from "../../../../../entities/foodStatus";
import {ItemCategory} from "../../../../../entities/ItemCategory";
import {Room} from "../../../../../entities/room";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import {SearchService} from "../../../../../services/search.service";
import {Guest} from "../../../../../entities/guest";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Order} from "../../../../../entities/order";

@Component({
  selector: 'app-order-add',
  standalone: true,
  imports: [
    FormDirective,
    ReactiveFormsModule,
    ColComponent,
    NgForOf,
    FormLabelDirective,
    FormSelectDirective,
    RowComponent,
    FormControlDirective,
    FormTextDirective,
    NgbInputDatepicker,
    ButtonDirective,
    NgIf,
    TableDirective
  ],
  templateUrl: './order-add.component.html',
  styleUrl: './order-add.component.scss'
})
export class OrderAddComponent  implements OnInit{
  public error=null;


  itemCategories: ItemCategory[] = [];
  foods: Food[] = [];
  foodStatus: FoodStatus[] = [];
  foodItems: Food[] = [];
  rooms: Room[] = [];
  guests: any[] = [];
  orderStatus: any[] = [];
  formData = new FormData();
  orderForm: FormGroup;
   totalAmount = 0;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.orderForm = this.fb.group({

      id:[''],
      guest_id: ['', [Validators.required]],
      r_id: [''],
      order_date: ['', [Validators.required]],
      order_amount: ['', [Validators.required]],
      oder_status_id: ['', [Validators.required]],
      item_category_id: ['', [Validators.required]],
      food_id: ['', [Validators.required]],
      quantity: [''],

    });

  }

  get foodQuantityField(): FormControl {
    return this.orderForm.controls['quantity'] as FormControl;
  }
  get roomIdField(): FormControl {
    return this.orderForm.controls['r_id'] as FormControl;
  }
  get orderDateField(): FormControl {
    return this.orderForm.controls['order_date'] as FormControl;
  }
  get orderAmountField(): FormControl {
    return this.orderForm.controls['order_amount'] as FormControl;
  }
  get itemCateField(): FormControl {
    return this.orderForm.controls['item_category_id'] as FormControl;
  }
  get guestIdField(): FormControl {
    return this.orderForm.controls['guest_id'] as FormControl;
  }
  get foodIdField(): FormControl {
    return this.orderForm.controls['food_id'] as FormControl;
  }
  get orderStatusField(): FormControl {
    return this.orderForm.controls['oder_status_id'] as FormControl;
  }

  getRm() {
    this.allServe.getRoom().subscribe(
      (response: any) => {
        this.rooms = response.data;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }

  formatDate(obj:any){
    return obj['year']+'-'+obj['month']+'-'+obj['day']
  }
  getGuest() {
    this.allServe.getGuests().subscribe(
      (response: any) => {
        this.guests = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }

  getItemCategory() {
    this.allServe.getItemCategory().subscribe(
      (response: any) => {
        this.itemCategories = response.data;
      },
      (error) => {
        console.error('Error fetching Item Category:', error);
      }
    );
  }
  getFoods(data:any) {
    this.allServe.getFoodByItemCateId(data).subscribe(
      (data: any) => {
        this.foods = data;
      },
      (error) => {
        console.error('Error fetching Item Category:', error);
      }
    );
  }
  getFoodsById(id: any) {
    const selectedFoodId = id;

    if (selectedFoodId) {
      this.allServe.getFoodById(selectedFoodId).subscribe(
        (data: any) => {

            const food = Array.isArray(data) ? data[0] : data; // Get the first food item

            this.foodItems.push({
              ...food,
              quantity: 0
            });
            // this.foodQuantityField.setValue("")

          },
        (error) => {
          console.error('Error fetching food item:', error);
        }
      );
    }
  }
  getOrderStatus() {
    this.allServe.getOrderStatus().subscribe(
      (response: any) => {
        this.orderStatus = response.data;
      },
      (error) => {
        console.error('Error fetching Item Category:', error);
      }
    );
  }
  getFoodStatus() {
    this.allServe.getFoodStatus().subscribe(
      (response: any) => {
        this.foodStatus = response.data;
      },
      (error) => {
        console.error('Error fetching Item Category:', error);
      }
    );
  }


  calculateOrderAmount(id:any) {
   const quantity = this.orderForm.controls['quantity'].value;

    let f_amount = 0;
    let o_amount = 0;

    for (let i = 0; i < this.foodItems.length; i++) {
      const foodAmount = Number(this.foodItems[i]['food_amount']) || 0;
      o_amount =foodAmount;
      if (this.foodItems[i].id == id) {
        this.foodItems[i].quantity = quantity;
      }
    }
    f_amount = quantity * o_amount;
    this.totalAmount += f_amount;
    this.orderForm.controls['order_amount'].setValue(this.totalAmount+".00");

  }


  ngOnInit() {
    this.getItemCategory();
    this.getRm();
    this.getGuest();
    this.getOrderStatus();
    this.getFoodStatus();

  }


  removeFoodItem(index: number,amount:any) {
    let quantity = this.foodItems[index].quantity;
    const foodAmount = Number(amount) || 0;

    // @ts-ignore
    let f_amount = quantity * foodAmount;

    this.totalAmount -= f_amount;
    this.orderForm.controls['order_amount'].setValue(this.totalAmount+".00");
    this.foodItems.splice(index, 1);
  }


  clearForm() {
    this.foodIdField.setValue("Select Food Item...");
    this.foodQuantityField.setValue("");
    this.orderDateField.setValue("");
    this.orderAmountField.setValue("");
    this.itemCateField.setValue("Select Item Category...");
    this.roomIdField.setValue("Select Room Number");
    this.orderStatusField.setValue("Select Order Status: ");
    this.guestIdField.setValue("Select Guest");

  }

  onSubmit() {

    let data = (this.orderForm).value
    let data2 = this.foodItems
    this.formData = new FormData();
    if (this.orderForm.valid) {

      let order = new Order();

      order.r_id= data.r_id;
      order.guest_id= data.guest_id;
      order.order_date= this.formatDate(data.order_date);
      order.order_amount= data.order_amount;
      order.oder_status_id= data.oder_status_id;

      this.formData.append('form', JSON.stringify(order));
      this.formData.append('food', JSON.stringify(data2));
      const submissionObservable = from( this.allServe.submitOrder(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.clearForm();
            return data; // If you need to return a value for further processing
          }),
          catchError((error) => {
            // Handle errors here
            this.handleError(error);
            return throwError(error); // Re-throw the error if you want to propagate it further
          })
        )
        .subscribe();
    }
    // console.log(data)
    // console.log((this.foodItems))
  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }

}
