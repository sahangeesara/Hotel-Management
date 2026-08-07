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
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {Food} from "../../../../../entities/food";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-food-update',
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
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './food-update.component.html',
  styleUrl: './food-update.component.scss'
})
export class FoodUpdateComponent implements OnInit {

  public error: any = null;
  imageUrl?: string = 'assets/default.png';
  file?: any;
  itemCategories: any[] = [];
  foodStatus: any[] = [];
  formData = new FormData();
  foodUpdateForm: FormGroup;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.foodUpdateForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      quantity: [''],
      food_amount: ['', [Validators.required]],
      image: ['', [Validators.required]],
      item_category_id: ['', [Validators.required]],
      food_status_id: ['', [Validators.required]],
      food_no: ['', [Validators.required]],
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
  get foodNumberField(): FormControl {
    return this.foodUpdateForm.controls['food_no'] as FormControl;
  }

  clearForm() {
    this.foodUpdateForm.reset();
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

  foodUpdate() {
    this.formData = new FormData();
    if (this.foodUpdateForm.valid) {
      let food = new Food();
      let id = this.foodIdField.value;

      food.name = this.foodNameField.value;
      food.quantity = this.foodQuantityField.value;
      food.food_amount = this.foodAmountField.value;
      food.item_category = this.itemCategoryField.value;
      food.food_status = this.foodStatusField.value;
      food.food_no = this.foodNumberField.value;

      if (this.file) {
        this.formData.append('image', this.file, this.file.name);
      }
      this.formData.append('_method', 'patch');
      this.formData.append('form', JSON.stringify(food));

      const submissionObservable = from(this.allServe.updateFood(this.formData, id));
      submissionObservable
        .pipe(
          map((data) => {
            this.clearForm();
            this.showAlert('Food item updated successfully!', 'success');
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
      this.foodUpdateForm.markAllAsTouched();
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

  getData(data: any) {
    this.foodIdField.setValue(data.id);
    this.foodNameField.setValue(data.name);
    this.foodQuantityField.setValue(data.quantity);
    this.foodAmountField.setValue(data.food_amount);
    this.imageUrl = data.image_url;
    this.itemCategoryField.setValue(data.item_category_id);
    this.foodStatusField.setValue(data.food_status_id);
    this.foodNumberField.setValue(data.food_no);
    this.showAlert('Food details loaded for update.', 'info');
  }
}
