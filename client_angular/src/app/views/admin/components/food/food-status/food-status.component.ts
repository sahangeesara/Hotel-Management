import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,FormTextDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {FoodStatus} from "../../../../../entities/foodStatus";
import { IconDirective } from '@coreui/icons-angular';
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-food-status',
  standalone: true,
  imports: [
    IconDirective,
    FormTextDirective,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    TableDirective
  ],
  templateUrl: './food-status.component.html',
  styleUrl: './food-status.component.scss'
})
export class FoodStatusComponent {

  foodStatuses: any[] = [];
  formData = new FormData();
  foodStatusForm: FormGroup;
  public error=null;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.foodStatusForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
    });

  }

  get foodStIdField(): FormControl { return this.foodStatusForm.controls['id'] as FormControl;}
  get foodStNameField(): FormControl { return this.foodStatusForm.controls['name'] as FormControl;}

  clearForm() {this.foodStNameField.setValue("");}
  onSubmit() {
    this.formData = new FormData();
    if (this.foodStatusForm.valid) {

      let foodSt = new FoodStatus();

      foodSt.name= this.foodStNameField.value;

      this.formData.append('form', JSON.stringify(foodSt));
      const submissionObservable = from( this.allServe.submitFoodStatus(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getFoodSt();
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
  foodStatusUpdate() {
    this.formData = new FormData();
    let id;
    if (this.foodStatusForm.valid) {

      let foodSt = new FoodStatus();

      id = this.foodStIdField.value;

      foodSt.name = this.foodStNameField.value;

      this.formData.append('form', JSON.stringify(foodSt));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateFoodStatus(this.formData,id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getFoodSt();
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

  foodStatusDelete(id:any){
    this.allServe.deleteFoodStatus(id).subscribe(
      (data: any) => {
        this.getFoodSt();
      },
      (error) => {
        console.error('Error fetching food status:', error);
      }
    );

  }

  getFoodStById(id:any) {
    this.allServe.getFoodStatusById(id).subscribe(
      (foodStatus:any) => {

        this.foodStIdField.setValue(foodStatus.id);
        this.foodStNameField.setValue(foodStatus.name);
      },
      (error) => {
        console.error('Error fetching food status:', error);
      }
    );
  }


  getFoodSt() {
    this.allServe.getFoodStatus().subscribe(
      (response: any) => {
        this.foodStatuses = response.data;
      },
      (error) => {
        console.error('Error fetching food status:', error);
      }
    );
  }


  ngOnInit() {
    this.getFoodSt();
  }
}
