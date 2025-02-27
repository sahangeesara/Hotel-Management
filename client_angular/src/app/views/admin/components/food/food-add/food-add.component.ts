import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {Employee} from "../../../../../entities/employee";
import {Food} from "../../../../../entities/food";
import {FoodStatus} from "../../../../../entities/foodStatus";
import {ItemCategory} from "../../../../../entities/ItemCategory";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-food-add',
  standalone: true,
  imports: [
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './food-add.component.html',
  styleUrl: './food-add.component.scss'
})
export class FoodAddComponent {

  imageUrl?: string = 'assets/default.png';
  file?: any;
  itemCategories: ItemCategory[] = [];
  foodStatus: FoodStatus[] = [];
  formData = new FormData();
  foodForm: FormGroup;
  public error=null;


  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.foodForm = this.fb.group({

      name: ['', [Validators.required]],
      quantity: [''],
      food_amount: ['', [Validators.required]],
      image: ['', [Validators.required]],
      item_category_id: ['', [Validators.required]],
      food_status_id: ['', [Validators.required]],
    });

  }
  get foodNameField(): FormControl {
    return this.foodForm.controls['name'] as FormControl;
  }
  get foodQuantityField(): FormControl {
    return this.foodForm.controls['quantity'] as FormControl;
  }
  get foodAmountField(): FormControl {
    return this.foodForm.controls['food_amount'] as FormControl;
  }
  get foodImageField(): FormControl {
    return this.foodForm.controls['image'] as FormControl;
  }
  get itemCategoryField(): FormControl {
    return this.foodForm.controls['item_category_id'] as FormControl;
  }
  get foodStatusField(): FormControl {
    return this.foodForm.controls['food_status_id'] as FormControl;
  }


  clearForm() {
    this.foodForm.reset();
    this.itemCategoryField.setValue("Select Item Category");
    this.foodStatusField.setValue("Select Food Status");

  }
  selectImage(e:any):void{
    this.file = e.target.files ? e.target.files[0] : '';

    if (this.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;

      };
    }

  }
   onSubmit() {
    this.formData = new FormData();
    if (this.foodForm.valid) {

      let food = new Food();

      food.name= this.foodNameField.value;
      food.quantity= this.foodQuantityField.value;
      food.food_amount= this.foodAmountField.value;
      food.item_category= this.itemCategoryField.value;
      food.food_status= this.foodStatusField.value;

      this.formData.append('image', this.file, this.file.name);
      this.formData.append('form', JSON.stringify(food));

      const submissionObservable = from( this.allServe.submitFood(this.formData));

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
  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
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
  getFoodStatus() {
    this.allServe.getFoodStatus().subscribe(
      (response: any) => {
        this.foodStatus = response.data;
      },
      (error) => {
        console.error('Error fetching Food Status:', error);
      }
    );
  }


  ngOnInit() {
    this.getItemCategory();
    this.getFoodStatus();
  }

}
