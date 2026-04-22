import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {HotelService} from "../../../../../services/hotel.service";
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent,
  ModalTitleDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {CustomerUpdateComponent} from "../../customer/customer-update/customer-update.component";
import {IconDirective} from "@coreui/icons-angular";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [
    ButtonDirective,
    ColComponent,
    CustomerUpdateComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    IconDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent,
    TableDirective
  ],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.scss'
})
export class HotelComponent implements OnInit {
  public error=null;
  hotels: any[] = [];
  roomSetups: any[] = [];
  formData = new FormData();
  hotelForm: FormGroup;
  HotelData:any;
  public isEditMode = false;
  constructor(   private hotelServe: HotelService,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.hotelForm = this.fb.group({

      id: [''],
      hotel_no: [''],
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      room_setups_id: ['', [Validators.required]],
      capacity: ['', [Validators.required]]
    });

  }


  clearForm() {
    this.hotelForm.reset();
    this.isEditMode = false;
  }

  getHotelById(id:any){
    this.hotelServe.getHotelById(id).subscribe(
      (Hotel:any) => {
        this.hotelForm.patchValue({
          id: Hotel.id,
          Hotel_no: Hotel.Hotel_no,
          name: Hotel.name
        });
        this.isEditMode = true; // Enable update button
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  updateHotel() {
    if (this.hotelForm.valid) {
      this.HotelData = this.hotelForm.getRawValue();

      this.hotelServe.updateHotel(this.HotelData, this.HotelData.id).subscribe(
        (response) => {
          // Handle successful response
          this.getHotel();
          this.clearForm();
        },
        (error) => {
          // Handle error response
          this.handleError(error);
        }
      );
    }
  }

  getHotel() {
    this.hotelServe.getHotel().subscribe(
      (response: any) => {
        this.hotels = response.data;
      },
      (error) => {
        console.error('Error fetching hotels:', error);
      }
    );
  }
  getRoomSetup() {
    this.hotelServe.getRoomSetup().subscribe(
      (response: any) => {
        this.roomSetups = response;
      },
      (error) => {
        console.error('Error fetching Room Setups:', error);
      }
    );
  }

  onSubmit() {
    if (this.hotelForm.valid) {

      this.HotelData = this.hotelForm.getRawValue();

      this.hotelServe.submitHotel(this.HotelData).subscribe(
        (response) => {
          // Handle successful submission
          this.getHotel();
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

  deleteHotel(id:any){
    this.hotelServe.deleteHotel(id).subscribe(
      (data: any) => {
        this.getHotel();
      },
      (error) => {
        console.error('Error fetching hotel:', error);
      }
    );

  }

  ngOnInit() {
    this.getHotel();
    this.getRoomSetup();
  }
}
