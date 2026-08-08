import { Component, OnInit } from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective,
  FormSelectDirective, RowComponent, TableDirective
} from "@coreui/angular";
import { IconDirective } from "@coreui/icons-angular";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { AllServiceService } from "../../../../../services/all-service.service";
import { SearchService } from "../../../../../services/search.service";
import { TravelBookingService } from "../../../../../services/travel-booking.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transport-book',
  standalone: true,
  imports: [
    AlertComponent,
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
  public error: any = null;
  bookingData: any;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(
    private allServe: AllServiceService,
    private travelServes: TravelBookingService,
    private searchServe: SearchService,
    private fb: FormBuilder,
  ) {
    this.transportForm = this.fb.group({
      id: [''],
      booking_no: [''],
      guest_id: ['', Validators.required],
      province_id: ['', Validators.required],
      passengers: ['', [Validators.required, Validators.min(1)]],
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
    });
  }

  showAlert(message: string, color: string = 'success') {
    this.alertMessage = message;
    this.alertColor = color;
    setTimeout(() => {
      this.clearAlert();
    }, 4000);
  }

  clearAlert() {
    this.alertMessage = '';
  }

  getGuest() {
    this.allServe.getGuests().subscribe({
      next: (response: any) => {
        this.guests = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getProvinces() {
    this.travelServes.getProvinces().subscribe({
      next: (response: any) => {
        this.provinces = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getServiceTypes() {
    this.travelServes.getServiceTypes().subscribe({
      next: (response: any) => {
        this.serviceTypes = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
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
        if (data.length === 0) {
          this.showAlert('No transport bookings found matching search criteria.', 'info');
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearSearchForm() {
    Swal.fire({
      title: 'Clear Search Filters?',
      text: "This will reset search criteria and reload all transport bookings.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tourSearchBookForm.reset();
        this.tourSearchBookForm.patchValue({
          guest_id: '',
          province_id: '',
          vehicle_type_id: '',
          tour_type_id: '',
        });
        this.getTransportBookings();
        this.showAlert('Search filters cleared successfully.', 'success');
      }
    });
  }

  getVehicleTypes() {
    this.travelServes.getVehicleTypes().subscribe({
      next: (response: any) => {
        this.vehicleTypes = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getTourType() {
    this.travelServes.getTourType().subscribe({
      next: (response: any) => {
        this.tourTypes = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getDurations() {
    this.travelServes.getDurations().subscribe({
      next: (response: any) => {
        this.durations = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getTransportBookings() {
    this.travelServes.getTransportBookings().subscribe({
      next: (response: any) => {
        this.transportBooks = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
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
      this.travelServes.submitTransportBookings(this.bookingData).subscribe({
        next: (response) => {
          this.getTransportBookings();
          this.clearForm();
          this.showAlert('Transport booking created successfully.', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.transportForm.markAllAsTouched();
    }
  }

  handleError(error: any) {
    console.error('Backend Error:', error);

    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'An unexpected server error occurred.';
    }

    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  updateTransport() {
    if (this.transportForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update this transport booking's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.bookingData = this.transportForm.getRawValue();

          this.travelServes.updateTransportBookings(this.bookingData, this.bookingData.id).subscribe({
            next: (response: any) => {
              this.getTransportBookings();
              this.clearForm();

              // Track modified fields nicely
              const updatedFields: string[] = [];
              Object.keys(this.transportForm.controls).forEach(key => {
                const control = this.transportForm.get(key);
                if (control && control.dirty) {
                  const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  updatedFields.push(formattedName);
                }
              });

              const bookingNo = response?.booking_no || this.bookingData.booking_no || 'Booking';
              if (updatedFields.length > 0) {
                this.showAlert(`Transport booking "${bookingNo}" updated successfully. Updated fields: ${updatedFields.join(', ')}`, 'success');
              } else {
                this.showAlert(`Transport booking "${bookingNo}" updated successfully.`, 'success');
              }
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.transportForm.markAllAsTouched();
    }
  }

  getTransport(id: any) {
    this.travelServes.getTransportBookingsById(id).subscribe({
      next: (data: any) => {
        this.transportForm.patchValue({
          ...data,
          pickup_date: data.pickup_date
            ? new Date(data.pickup_date).toISOString().split('T')[0]
            : null
        });
        this.showAlert('Transport booking details loaded for editing.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  deleteTransport(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this transport booking deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.travelServes.deleteTransportBookings(id).subscribe({
          next: (response: any) => {
            this.getTransportBookings();
            this.showAlert('Transport booking deleted successfully.', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }
}
