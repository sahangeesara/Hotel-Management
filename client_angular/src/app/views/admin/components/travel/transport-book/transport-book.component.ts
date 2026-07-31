import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective,
  FormSelectDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {HotelService} from "../../../../../services/hotel.service";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {TravelBookingService} from "../../../../../services/travel-booking.service";

@Component({
  selector: 'app-transport-book',
  standalone: true,
  imports: [
    ButtonDirective,
    IconDirective,
    FormLabelDirective,
    FormControlDirective,
    FormsModule,
    ColComponent,
    FormSelectDirective,
    NgForOf,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    DatePipe,
    NgIf,
    FormDirective
  ],
  templateUrl: './transport-book.component.html',
  styleUrl: './transport-book.component.scss'
})
export class TransportBookComponent implements OnInit {
  transportForm: FormGroup;
  tourSearchBookForm: FormGroup;
  formData = new FormData();
  guests: any[] = [];
  provinces: any[] = [];
  serviceTypes: any[] = [];
  vehicleTypes: any[] = [];
  tourTypes: any[] = [];
  durations: any[] = [];
  transportBooks: any[] = [];
  public error=null;
  bookingData:any;


  constructor(  private allServe: AllServiceService,
                 private travelServes:TravelBookingService,
                 private searchServe: SearchService,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {
    this.transportForm = this.fb.group({

      id: [''],
      booking_no: [''],
      guest_id: ['', Validators.required],
      province_id: ['', Validators.required],
      passengers: ['', [    Validators.required, Validators.min(1) ]],
      service_type_id: ['', Validators.required],
      vehicle_type_id: ['', Validators.required],
      tour_type_id: ['', Validators.required],
      pickup_location: ['', Validators.required],
      drop_location: ['', Validators.required],
      pickup_date: ['', Validators.required],
      pickup_time: ['', Validators.required],
      duration_id: ['', Validators.required],
      custom_duration: [''],
      requests: ['']

    });

    this.tourSearchBookForm = this.fb.group({
      guest_id: [''],
      province_id: [''],
      vehicle_type_id: [''],
      tour_type_id: [''],
    })
  }

  getGuest() {
    this.allServe.getGuests().subscribe(
      (response: any) => {
        this.guests = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }
  getProvinces() {
    this.travelServes.getProvinces().subscribe(
      (response: any) => {
        this.provinces = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }

  getServiceTypes() {
    this.travelServes.getServiceTypes().subscribe(
      (response: any) => {
        this.serviceTypes = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }


  search() {
    const filters = {
      guest_id: this.tourSearchBookForm.get('guest_id')?.value?.trim() || '',
      province_id: this.tourSearchBookForm.get('province_id')?.value?.trim() || '',
      vehicle_type_id: this.tourSearchBookForm.get('vehicle_type_id')?.value?.trim() || '',
      tour_type_id: this.tourSearchBookForm.get('tour_type_id')?.value?.trim() || '',

    };

    if (!filters.tour_type_id && !filters.vehicle_type_id && !filters.province_id && !filters.guest_id) {
      this.getTransportBookings();
      return;
    }

    this.searchServe.getTransportBookData(filters).subscribe({
      next: (data: any) => {
        this.transportBooks = data;
      },
      error: (error) => {
        console.error('Error fetching hotel event:', error);
      }
    });
  }

  clearSearchForm() {
    this.tourSearchBookForm.reset();
    this.getTransportBookings();
    this.tourSearchBookForm.patchValue(
      {
        hotel_id: '',
        event_id: '',
        event_type_id: '',
        room_id: '',
        event_date: '',
      }
    )
  }
  getVehicleTypes() {
    this.travelServes.getVehicleTypes().subscribe(
      (response: any) => {
        this.vehicleTypes = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }
  getTourType() {
    this.travelServes.getTourType().subscribe(
      (response: any) => {
        this.tourTypes = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }
  getDurations() {
    this.travelServes.getDurations().subscribe(
      (response: any) => {
        this.durations = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }
  getTransportBookings() {
    this.travelServes.getTransportBookings().subscribe(
      (response: any) => {
        this.transportBooks = response.data;
        console.log(this.transportBooks);
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }

  clearForm() {
    this.transportForm.reset();
  }

  ngOnInit(): void {
    this.getGuest();
    this.getProvinces();
    this.getServiceTypes();
    this.getVehicleTypes();
    this.getTourType();
    this.getDurations();
    this.getTransportBookings();
    }

  onSubmit() {
    if (this.transportForm.valid) {
      this.bookingData = this.transportForm.getRawValue();
      this.travelServes.submitTransportBookings(this.bookingData).subscribe(
        (response) => {
          // Handle successful submission
          this.getTransportBookings();
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }

  handleError(error: { error: null; }) {
    return this.error = error.error;
  }

  updateTransport() {
    this.formData = new FormData();
    if (this.transportForm.valid) {

      this.bookingData = this.transportForm.getRawValue();

      this.travelServes.updateTransportBookings(this.bookingData, this.bookingData.id).subscribe(
        (response) => {
          this.getTransportBookings()
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }

  getTransport(id: any) {
    this.travelServes.getTransportBookingsById(id).subscribe(
      (data: any) => {
        this.transportForm.patchValue({
          ...data,
          pickup_date: data.pickup_date
            ? new Date(data.pickup_date).toISOString().split('T')[0]
            : null
        });
      },
      (error) => {
        console.error('Error fetching transport Booking:', error);
      }
    );
  }

  deleteTransport(id:any) {
    this.travelServes.deleteTransportBookings(id).subscribe(
      (response: any) => {
          this.getTransportBookings();
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }
}
