import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
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
    NgIf
  ],
  templateUrl: './transport-book.component.html',
  styleUrl: './transport-book.component.scss'
})
export class TransportBookComponent implements OnInit {
  transportForm: FormGroup;
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


  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private hotelServes:HotelService,
                 private travelServes:TravelBookingService,
                 private searchServe: SearchService,
                 private router:Router,
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

      this.allServe.submitCustomer(this.bookingData).subscribe(
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

  }

  getTransport(id: any) {
    this.travelServes.getTransportBookingsById(id).subscribe(
      (response: any) => {
        this.transportBooks = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
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
