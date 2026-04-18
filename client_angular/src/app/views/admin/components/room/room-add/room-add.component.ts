import {Component, OnInit} from '@angular/core';
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
import { IconDirective } from '@coreui/icons-angular';
import {HotelService} from "../../../../../services/hotel.service";

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
    NgIf,
  ],
  templateUrl: './room-add.component.html',
  styleUrl: './room-add.component.scss'
})
export class RoomAddComponent implements OnInit {

  public error=null;
  rooms: any[] = [];
  hotels: any[] = [];
  roomsCategories: any[] = [];
  formData = new FormData();
  roomForm: FormGroup;
  roomData:any;
  constructor(
                 private allServe: AllServiceService,
                 private hotelServe: HotelService,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.roomForm = this.fb.group({

      id: [''],
      r_no: [''],
      hotel_id: ['',[Validators.required]],
      capacity: ['',[Validators.required]],
      r_cost: ['', [Validators.required]],
      r_category_id: ['', Validators.required],
    });

  }
  get rmCategoryField(): FormControl {
    return this.roomForm.controls['r_category_id'] as FormControl;
  }

  clearForm() {
    this.roomForm.reset();
    this.rmCategoryField.setValue("Select Rooms Category");
  }

  getRoomById(id:any){
    this.allServe.getRoomById(id).subscribe(
      (room:any) => {

        this.roomForm.patchValue(room);
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  updateRoom() {
    if (this.roomForm.valid) {
      this.roomData = this.roomForm.getRawValue();

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
  getHotels() {
    this.hotelServe.getHotel().subscribe(
      (response: any) => {
        this.hotels = response.data;
      },
      (error) => {
        console.error('Error fetching Hotel:', error);
      }
    );
  }

  onSubmit() {
    if (this.roomForm.valid) {

      this.roomData = this.roomForm.getRawValue();

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
    this.getHotels();
  }

}
