import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    ButtonDirective,
    ColComponent,
    DatePipe,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    IconDirective,
    NgForOf,
    NgIf,
    NgbInputDatepicker,
    ReactiveFormsModule,
    RowComponent,
    TableDirective
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {

  public error=null;
  rooms: any[] = [];
  roomsCategories: any[] = [];
  formData = new FormData();
  eventForm: FormGroup;
  roomData:any;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.eventForm = this.fb.group({

      id: [''],
      r_no: [''],
      p_cost: ['', [Validators.required]],
      eventName: ['', [Validators.required]],
      r_category_id: ['', Validators.required],
    });

  }
  get rmIdField(): FormControl {
    return this.eventForm.controls['id'] as FormControl;
  }
  get rmNoField(): FormControl {
    return this.eventForm.controls['r_no'] as FormControl;
  }
  get rmCostField(): FormControl {
    return this.eventForm.controls['r_cost'] as FormControl;
  }

  get rmCategoryField(): FormControl {
    return this.eventForm.controls['r_category_id'] as FormControl;
  }

  clearForm() {
    this.eventForm.reset();
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

  updateRoom() {
    if (this.eventForm.valid) {
      this.roomData = this.eventForm.getRawValue();

      this.allServe.roomUpdate(this.roomData, this.roomData.id).subscribe(
        (response) => {
          // Handle successful response
          this.getRm();
          this.clearForm();
        },
        (error) => {
          // Handle error response
          this.handleError(error);
        }
      );
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
    if (this.eventForm.valid) {

      this.roomData = this.eventForm.getRawValue();

      this.allServe.submitRoom(this.roomData).subscribe(
        (response) => {
          // Handle successful submission
          this.getRm();
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
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
