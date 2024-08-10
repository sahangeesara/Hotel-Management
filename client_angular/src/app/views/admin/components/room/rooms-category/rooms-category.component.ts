import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {EmployeeType} from "../../../../../entities/employeeTypee";
import {RoomsCategory} from "../../../../../entities/roomsCategory";

@Component({
  selector: 'app-rooms-category',
  standalone: true,
  imports: [
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
  templateUrl: './rooms-category.component.html',
  styleUrl: './rooms-category.component.scss'
})
export class RoomsCategoryComponent {
  roomsCategories: any[] = [];
  formData = new FormData();
  rmCategoryForm: FormGroup;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.rmCategoryForm = this.fb.group({

      name: ['', [Validators.required]],
    });

  }

  get rmCateNameField(): FormControl {
    return this.rmCategoryForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.rmCateNameField.setValue("");

  }
  async onSubmit() {
    this.formData = new FormData();
    if (this.rmCategoryForm.valid) {

      let rmCate = new RoomsCategory();

      rmCate.name= this.rmCateNameField.value;

      this.formData.append('form', JSON.stringify(rmCate));
      await this.allServe.submitRoomsCategory(this.formData);
      this.getRmCate();
      this.clearForm();
      this.toastr.success("Rooms Category Successfully submit ");
    }
  }
  getRmCate() {
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
    this.getRmCate();
  }

}
