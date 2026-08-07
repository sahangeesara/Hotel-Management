import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {Food} from "../../../../../entities/food";
import {FoodStatus} from "../../../../../entities/foodStatus";
import {ItemCategory} from "../../../../../entities/ItemCategory";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-food-add',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './food-add.component.html',
  styleUrl: './food-add.component.scss'
})
export class FoodAddComponent implements OnInit {

  imageUrl?: string = 'assets/default.png';
  file?: any;
  itemCategories: ItemCategory[] = [];
  foodStatus: FoodStatus[] = [];
  formData = new FormData();
  foodForm: FormGroup;
  public error: any = null;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
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
    this.imageUrl = 'assets/default.png';
    this.file = null;
    this.itemCategoryField.setValue('');
    this.foodStatusField.setValue('');
  }

  selectImage(e: any): void {
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

      food.name = this.foodNameField.value;
      food.quantity = this.foodQuantityField.value;
      food.food_amount = this.foodAmountField.value;
      food.item_category = this.itemCategoryField.value;
      food.food_status = this.foodStatusField.value;

      if (this.file) {
        this.formData.append('image', this.file, this.file.name);
      }
      this.formData.append('form', JSON.stringify(food));

      const submissionObservable = from(this.allServe.submitFood(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            this.clearForm();
            this.showAlert('Food item created successfully!', 'success');
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
      this.foodForm.markAllAsTouched();
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

  ngOnInit() {
    this.getItemCategory();
    this.getFoodStatus();
  }
}
