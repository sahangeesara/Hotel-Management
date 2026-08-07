import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {HotelService} from "../../../../../services/hotel.service";
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {NgForOf, NgIf} from "@angular/common";
import {SearchService} from "../../../../../services/search.service";

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    IconDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent,
    TableDirective, ColComponent, FormDirective,
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
  hotelSearchForm: FormGroup;
  hotelData:any;
  public isEditMode = false;
  isUpdateVisible: boolean = true;
  isSubmitVisible: boolean = false;

  constructor(   private hotelServe: HotelService,
                 private searchServe: SearchService,
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

    this.hotelSearchForm = this.fb.group({
      name: [''],
      phone: [''],
      room_setups_id: [''],
      capacity: [''],
    })
  }


  clearForm() {
    this.hotelForm.reset();
    this.isEditMode = false;
  }

  getHotelById(id:any){
    this.hotelServe.getHotelById(id).subscribe(
      (hotel:any) => {
        this.isUpdateVisible = false;
        this.isSubmitVisible = true;
        this.hotelForm.patchValue(hotel);
        this.isEditMode = true; // Enable update button
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  updateHotel() {
    if (this.hotelForm.valid) {
      this.hotelData = this.hotelForm.getRawValue();

      this.hotelServe.updateHotel(this.hotelData, this.hotelData.id).subscribe(
        (response) => {
          // Handle successful response
          this.getHotel();
          this.clearForm();
          this.isUpdateVisible = true;
          this.isSubmitVisible = false;
        },
        (error) => {
          // Handle error response
          this.handleError(error);
        }
      );
    }
  }

  search() {
    const filters = {
      name: this.hotelSearchForm.get('name')?.value?.trim() || '',
      phone: this.hotelSearchForm.get('phone')?.value?.trim() || '',
      room_setups_id: this.hotelSearchForm.get('room_setups_id')?.value?.trim() || '',
      capacity: this.hotelSearchForm.get('capacity')?.value?.trim() || '',

    };

    if (!filters.name && !filters.phone && !filters.room_setups_id && !filters.capacity ) {
      this.getHotel();
      return;
    }

    this.searchServe.getHotelData(filters).subscribe({
      next: (data: any) => {
        this.hotels = data;
      },
      error: (error) => {
        console.error('Error fetching hotel:', error);
      }
    });
  }

  clearSearchForm() {
    this.hotelSearchForm.reset();
    this.getHotel();
    this.hotelSearchForm.patchValue(
      {
        hotel_id: '',
        event_id: '',
        event_type_id: '',
        room_id: '',
        event_date: '',
      }
    )
  }

  getHotel() {
    this.hotelServe.getHotel().subscribe(
      (response: any) => {
        this.hotels = response.data;
        console.log(this.hotels);
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

      this.hotelData = this.hotelForm.getRawValue();

      this.hotelServe.submitHotel(this.hotelData).subscribe(
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
        this.isUpdateVisible = false;
        this.isSubmitVisible = true;
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
