import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {Food} from "../../../../../entities/food";
import {FoodStatus} from "../../../../../entities/foodStatus";
import {ItemCategory} from "../../../../../entities/ItemCategory";
import {Room} from "../../../../../entities/room";

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
export class OrderAddComponent {


  itemCategories: ItemCategory[] = [];
  foods: Food[] = [];
  foodStatus: FoodStatus[] = [];
  foodItems: Food[] = [];
  rooms: Room[] = [];
  guests: any[] = [];
  orderStatus: any[] = [];
  formData = new FormData();
  orderForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.orderForm = this.fb.group({

      id:[''],
      guest_id: ['', [Validators.required]],
      r_id: ['', [Validators.required]],
      order_date: ['', [Validators.required]],
      order_amount: ['', [Validators.required]],
      oder_status_id: ['', [Validators.required]],
      item_category_id: ['', [Validators.required]],
      food_status: ['', [Validators.required]],
      food_id: ['', [Validators.required]],
      quantity: [''],
    });

  }

  get foodQuantityField(): FormControl {
    return this.orderForm.controls['quantity'] as FormControl;
  }
  get foodStatusField(): FormControl {
    return this.orderForm.controls['food_status_id'] as FormControl;
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
          // console.log(food.food_status.name)

          this.foodItems.push({
            // Create a new Food object with initial values
            ...food, // Spread operator to copy properties from fetched food

          });
          // for (let i = 0; i < data.length-1; i++) { // Use `<` for loop to iterate through all items
          //   console.log(`food_status.name: ${data[i].food_status.name}`);
          //   console.log(`quantity: ${data[i].quantity}`);
          // }
          this.orderForm.controls['food_status'].setValue(food.food_status)
          this.orderForm.controls['quantity'].setValue(food.quantity)
          // console.log(this.foodItems)
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


  ngOnInit() {
    this.getItemCategory();
    this.getRm();
    this.getGuest();
    this.getOrderStatus();
    this.getFoodStatus();
  }


  clearForm() {

  }

  onSubmit() {

  }
}
