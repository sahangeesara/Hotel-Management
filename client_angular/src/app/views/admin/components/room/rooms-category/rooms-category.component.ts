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
import { IconDirective } from '@coreui/icons-angular';
import {NgForOf, NgIf} from "@angular/common";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-rooms-category',
  standalone: true,
  imports: [
    IconDirective,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    NgIf,
    NgForOf
  ],
  templateUrl: './rooms-category.component.html',
  styleUrl: './rooms-category.component.scss'
})
export class RoomsCategoryComponent {
  roomsCategories: any[] = [];
  formData = new FormData();
  rmCategoryForm: FormGroup;
  public error=null;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private fb: FormBuilder,
  ) {

    this.rmCategoryForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
    });

  }

  get rmCateIdField(): FormControl {return this.rmCategoryForm.controls['name'] as FormControl;}
  get rmCateNameField(): FormControl {return this.rmCategoryForm.controls['name'] as FormControl;}

  clearForm() { this.rmCateNameField.setValue("");}

  onSubmit() {
    this.formData = new FormData();
    if (this.rmCategoryForm.valid) {

      let rmCate = new RoomsCategory();

      rmCate.name= this.rmCateNameField.value;

      this.formData.append('form', JSON.stringify(rmCate));
      const submissionObservable = from( this.allServe.submitRoomsCategory(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRmCate();
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


  rmCateDelete(id:any){
    this.allServe.RoomCategoryDelete(id).subscribe(
      (data: any) => {
        this.getRmCate();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

  getRmCateById(id:any) {
    this.allServe.getRoomCategoryById(id).subscribe(
      (roomCategory:any) => {

        this.rmCateIdField.setValue(roomCategory.id);
        this.rmCateNameField.setValue(roomCategory.name);
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  getRmCate() {
    this.allServe.getRoomsCategory().subscribe(
      (response: any) => {
        this.roomsCategories = response.data;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }


  updateRmCategory(){
    this.formData = new FormData();
    if (this.rmCategoryForm.valid) {

      let id = this.rmCateIdField.value
      let rmCate = new RoomsCategory();

      rmCate.id= this.rmCateIdField.value;
      rmCate.name= this.rmCateNameField.value;

      this.formData.append('form', JSON.stringify(rmCate));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateRoomCategory(this.formData,id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRmCate();
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

  ngOnInit() {
    this.getRmCate();
  }

}
