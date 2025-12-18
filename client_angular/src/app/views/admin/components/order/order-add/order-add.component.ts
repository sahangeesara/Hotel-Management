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
import {ToastrService} from "ngx-toastr";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {Food} from "../../../../../entities/food";
import {FoodStatus} from "../../../../../entities/foodStatus";
import {ItemCategory} from "../../../../../entities/ItemCategory";
import {Room} from "../../../../../entities/room";
import {SearchService} from "../../../../../services/search.service";
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
    TableDirective,
    FormsModule
  ],
  templateUrl: './order-add.component.html',
  styleUrl: './order-add.component.scss'
})
export class OrderAddComponent  implements OnInit{
  public error=null;

  notifications: string[] = [];
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
      item_category_id: [''],
      food_id: [''],
      quantity: [''],

    });

  }


  get roomIdField(): FormControl {
    return this.orderForm.controls['r_id'] as FormControl;
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
  addSelectedFood() {
    const selectedFoodId = this.orderForm.get('food_id')?.value;
    const quantityRaw = this.orderForm.get('quantity')?.value;

    const quantity = Number(quantityRaw);

    if (!selectedFoodId) {
      alert('Please select a food item first.');
      return;
    }

    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity greater than 0.');
      return;
    }

    // find selected food from foods list
    const food = this.foods.find((f: any) => String(f.id) === String(selectedFoodId));
    if (!food) {
      alert('Selected food not found in available list.');
      return;
    }

    // check if already added
    const existing = this.foodItems.find(f => String(f.id) === String(food.id));
    if (existing) {
      // if exists, just update quantity instead of blocking
      // @ts-ignore
      existing.quantity += quantity;
    } else {
      // add new item
      this.foodItems.push({
        ...food,
        quantity: quantity,
      });
    }

    // reset fields for next entry
    this.orderForm.patchValue({ quantity: '', food_id: '' });

    // recalculate total
    this.updateTotalAmount();
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

  updateTotalAmount() {
    this.totalAmount=0;

    for (let i = 0; i < this.foodItems.length; i++) {
      this.totalAmount += (Number(this.foodItems[i]['food_amount']) || 0) * (Number(this.foodItems[i]['quantity']) || 0);
      console.log(this.totalAmount);
    }
    this.orderForm.controls['order_amount'].setValue(this.totalAmount+".00");
  }


  ngOnInit() {
    this.getItemCategory();
    this.getRm();
    this.getGuest();
    this.getOrderStatus();
    this.getFoodStatus();

  }
// Remove a food item dynamically
  removeFoodItem(index: number,amount:any) {
    let quantity = this.foodItems[index].quantity;
    const foodAmount = Number(amount) || 0;

    // @ts-ignore
    let f_amount = quantity * foodAmount;

    this.foodItems.splice(index, 1);
    this.updateTotalAmount();
    this.orderForm.controls['order_amount'].setValue(this.totalAmount+".00");
  }


  clearForm() {
    this.foodItems = [];
    this.orderForm.reset();
    this.totalAmount=0;
    this.orderForm.controls['order_amount'].setValue(this.totalAmount+".00");
    this.foodIdField.setValue("Select Food Item...");
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

            this.notifications.push('Order submitted successfully!');
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
  }
  handleError(error: { error: null; }){
   alert(this.error=error.error);
  }


}
