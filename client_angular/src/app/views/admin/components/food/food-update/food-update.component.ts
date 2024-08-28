import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {Food} from "../../../../../entities/food";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-food-update',
  standalone: true,
  imports: [
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    NgForOf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './food-update.component.html',
  styleUrl: './food-update.component.scss'
})
export class FoodUpdateComponent {

  public error=null;
  imageUrl?: string = 'assets/default.png';
  file?: any;
  itemCategories: any[] = [];
  foodStatus: any[] = [];
  formData = new FormData();
  foodUpdateForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.foodUpdateForm = this.fb.group({

      id:['',[Validators.required]],
      name: ['', [Validators.required]],
      quantity: [''],
      food_amount: ['', [Validators.required]],
      image: ['', [Validators.required]],
      item_category_id: ['', [Validators.required]],
      food_status_id: ['', [Validators.required]],
    });

  }

  get foodIdField(): FormControl {
    return this.foodUpdateForm.controls['id'] as FormControl;
  }
  get foodNameField(): FormControl {
    return this.foodUpdateForm.controls['name'] as FormControl;
  }
  get foodQuantityField(): FormControl {
    return this.foodUpdateForm.controls['quantity'] as FormControl;
  }
  get foodAmountField(): FormControl {
    return this.foodUpdateForm.controls['food_amount'] as FormControl;
  }
  get foodImageField(): FormControl {
    return this.foodUpdateForm.controls['image'] as FormControl;
  }
  get itemCategoryField(): FormControl {
    return this.foodUpdateForm.controls['item_category_id'] as FormControl;
  }
  get foodStatusField(): FormControl {
    return this.foodUpdateForm.controls['food_status_id'] as FormControl;
  }


  clearForm() {
    this.foodNameField.setValue("");
    this.foodQuantityField.setValue("");
    this.foodAmountField.setValue("");
    this.foodImageField.setValue("");
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
        // console.log(this.imageUrl)
      };
    }

  }
  foodUpdate() {
    this.formData = new FormData();
    if (this.foodUpdateForm.valid) {

      let food = new Food();

      let id =this.foodIdField.value;

      food.name= this.foodNameField.value;
      food.quantity= this.foodQuantityField.value;
      food.food_amount= this.foodAmountField.value;
      food.item_category= this.itemCategoryField.value;
      food.food_status= this.foodStatusField.value;

      this.formData.append('image', this.file, this.file.name);
      this.formData.append('_method', 'patch');
      this.formData.append('form', JSON.stringify(food));
      const submissionObservable =  from( this.allServe.updateFood(this.formData,id));
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


  getData(data:any){

    this.foodIdField.setValue(data.id);
    this.foodNameField.setValue(data.name);
    this.foodQuantityField.setValue(data.quantity);
    this.foodAmountField.setValue(data.food_amount);
    // this.foodImageField.setValue(data.image);
    this.itemCategoryField.setValue(data.item_category_id);
    this.foodStatusField.setValue(data.food_status_id);
  }
}
