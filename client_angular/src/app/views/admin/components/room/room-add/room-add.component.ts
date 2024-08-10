import { Component } from '@angular/core';
import {
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective, FormTextDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {Employee} from "../../../../../entities/employee";
import {Room} from "../../../../../entities/room";

@Component({
  selector: 'app-room-add',
  standalone: true,
    imports: [
        ButtonDirective,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        FormsModule,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './room-add.component.html',
  styleUrl: './room-add.component.scss'
})
export class RoomAddComponent {

  roomsCategories: any[] = [];
  formData = new FormData();
  roomForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.roomForm = this.fb.group({

      r_no: ['', [Validators.required]],
      r_cost: ['', [Validators.required]],
      r_category_id: ['', Validators.required],
    });

  }
  get rmNoField(): FormControl {
    return this.roomForm.controls['r_no'] as FormControl;
  }
  get rmCostField(): FormControl {
    return this.roomForm.controls['r_cost'] as FormControl;
  }

  get rmCategoryField(): FormControl {
    return this.roomForm.controls['r_category_id'] as FormControl;
  }

  clearForm() {
    this.rmNoField.setValue("");
    this.rmCostField.setValue("");
    this.rmCategoryField.setValue("Select Rooms Category");
  }

  async onSubmit() {
    this.formData = new FormData();
    if (this.roomForm.valid) {

      let rm = new Room();

      rm.r_no= this.rmNoField.value;
      rm.r_cost= this.rmCostField.value;
      rm.r_category_id= this.rmCategoryField.value;

      this.formData.append('form', JSON.stringify(rm));
      await this.allServe.submitRoom(this.formData);
      this.clearForm();
      this.toastr.success("Employee Successfully submit ");
    }
  }
  getRmCategory() {
    this.allServe.getRoomsCategory().subscribe(
      (data: any) => {
        this.roomsCategories = data;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }


  ngOnInit() {
    this.getRmCategory();
  }

}
