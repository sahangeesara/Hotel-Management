import { Component } from '@angular/core';
import {
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective, FormTextDirective, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {Employee} from "../../../../../entities/employee";
import {Room} from "../../../../../entities/room";
import { IconDirective } from '@coreui/icons-angular';
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-room-add',
  standalone: true,
  imports: [
    IconDirective,
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    TableDirective,
    NgIf
  ],
  templateUrl: './room-add.component.html',
  styleUrl: './room-add.component.scss'
})
export class RoomAddComponent {

  public error=null;
  rooms: any[] = [];
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

      id: [''],
      r_no: ['', [Validators.required]],
      r_cost: ['', [Validators.required]],
      r_category_id: ['', Validators.required],
    });

  }
  get rmIdField(): FormControl {
    return this.roomForm.controls['id'] as FormControl;
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
    this.rmIdField.setValue("");
    this.rmNoField.setValue("");
    this.rmCostField.setValue("");
    this.rmCategoryField.setValue("Select Rooms Category");
  }

  getRoomById(id:any){
    this.allServe.getRoomById(id).subscribe(
      (room:any) => {

        this.rmIdField.setValue(room.id);
        this.rmNoField.setValue(room.r_no);
        this.rmCostField.setValue(room.r_cost);
        this.rmCategoryField.setValue(room.r_category_id);
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  updateRoom(){
    this.formData = new FormData();
    if (this.roomForm.valid) {

      let id = this.rmIdField.value;
      let rm = new Room();

      rm.id= this.rmIdField.value;
      rm.r_no= this.rmNoField.value;
      rm.r_cost= this.rmCostField.value;
      rm.r_category_id= this.rmCategoryField.value;

      this.formData.append('form', JSON.stringify(rm));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateRoom(this.formData,id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRm();
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

  onSubmit() {
    this.formData = new FormData();
    if (this.roomForm.valid) {

      let rm = new Room();

      rm.r_no= this.rmNoField.value;
      rm.r_cost= this.rmCostField.value;
      rm.r_category_id= this.rmCategoryField.value;

      this.formData.append('form', JSON.stringify(rm));
      const submissionObservable = from( this.allServe.submitRoom(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRm();
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

  deleteRoom(id:any){
    this.allServe.deleteRoom(id).subscribe(
      (data: any) => {
        this.getRm();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }


  getRmCategory() {
    this.allServe.getRoomsCategory().subscribe(
      (response: any) => {
        this.roomsCategories = response.data;
      },
      (error) => {
        console.error('Error fetching rooms categories:', error);
      }
    );
  }


  ngOnInit() {
    this.getRm();
    this.getRmCategory();
  }

}
