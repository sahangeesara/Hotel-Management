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

  get foodStIdField(): FormControl {
    return this.foodStatusForm.controls['id'] as FormControl;
  }


  get foodStNameField(): FormControl {
    return this.foodStatusForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.foodStNameField.setValue("");

  }
  async onSubmit() {
    this.formData = new FormData();
    if (this.foodStatusForm.valid) {

      let foodSt = new FoodStatus();

      foodSt.name= this.foodStNameField.value;

      this.formData.append('form', JSON.stringify(foodSt));
      await this.allServe.submitFoodStatus(this.formData);
      this.getFoodSt();
      this.clearForm();
      this.toastr.success("Food status Successfully submit ");
    }
  }

  async foodStatusUpdate() {
    this.formData = new FormData();
    let $id;
    if (this.foodStatusForm.valid) {

      let foodSt = new FoodStatus();

      $id = this.foodStIdField.value;

      foodSt.name = this.foodStNameField.value;

      console.log(foodSt,$id)
       this.formData.append('form', JSON.stringify(foodSt));
      console.log(this.formData)
      await this.allServe.updateFoodStatus(this.formData, $id);

      this.getFoodSt();
      this.toastr.success("Food status Successfully submit ");
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
