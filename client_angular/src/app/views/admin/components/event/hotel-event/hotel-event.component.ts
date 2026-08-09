import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {HotelService} from "../../../../../services/hotel.service";
import {EventService} from "../../../../../services/event.service";
import {
  AlertComponent,
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel-event',
  standalone: true,
  imports: [
    AlertComponent,
    RowComponent,
    ColComponent,
    FormLabelDirective,
    FormsModule,
    FormControlDirective,
    FormSelectDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    DatePipe,
    TableDirective,
    IconDirective,
    FormDirective
  ],
  templateUrl: './hotel-event.component.html',
  styleUrl: './hotel-event.component.scss'
})
export class HotelEventComponent implements OnInit {
  organizers: any[] = [];
  hotelEvent: FormGroup;
  hotelSearchBookForm: FormGroup;
  formData = new FormData();
  @Input() organizer_id!: number;
  rooms: any[] = [];
  hotels: any[] = [];
  hotelsBooks: any[] = [];
  bookStatus: any[] = [];
  events: any[] = [];
  packages: any[] = [];
  eventTypes: any[] = [];
  hotelData: any;
  public error: any = null;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private allServe: AllServiceService,
    private searchServe: SearchService,
    private hotelServe: HotelService,
    private eventService: EventService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.hotelEvent = this.fb.group({
      id: [''],
      event_no: [''],
      event_id: [''],
      event_type_id: [''],
      event_date: [''],
      start_time: [''],
      end_time: [''],
      passengers: [''],
      hotel_id: [''],
      room_id: [''],
      package_id: [''],
      organizer_id: [''],
      book_status_id: [''],
      requests: [''],
      additional_services: [''],
    });

    this.hotelSearchBookForm = this.fb.group({
      hotel_id: [''],
      event_id: [''],
      event_type_id: [''],
      room_id: [''],
      event_date: [''],
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

  getOrganizer() {
    this.eventService.getOrganizer().subscribe({
      next: (response: any) => {
        this.organizers = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getBookStatus() {
    this.allServe.getBookStatus().subscribe({
      next: (response: any) => {
        this.bookStatus = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getEventTypes() {
    this.eventService.getEventType().subscribe({
      next: (response: any) => {
        this.eventTypes = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getEvent() {
    this.eventService.getEvent().subscribe({
      next: (response: any) => {
        this.events = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getPackage() {
    this.hotelServe.getPackage().subscribe({
      next: (response: any) => {
        this.packages = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  search() {
    const filters = {
      hotel_id: this.hotelSearchBookForm.get('hotel_id')?.value?.trim() || '',
      event_id: this.hotelSearchBookForm.get('event_id')?.value?.trim() || '',
      event_type_id: this.hotelSearchBookForm.get('event_type_id')?.value?.trim() || '',
      room_id: this.hotelSearchBookForm.get('room_id')?.value?.trim() || '',
      event_date: this.hotelSearchBookForm.get('event_date')?.value?.trim() || '',
    };

    if (!filters.hotel_id && !filters.event_id && !filters.event_type_id && !filters.room_id && !filters.event_date) {
      this.getHotelEventBook();
      return;
    }

    this.searchServe.getHotelBookData(filters).subscribe({
      next: (data: any) => {
        this.hotelsBooks = data;
        if (data.length === 0) {
          this.showAlert('No records found for the search criteria.', 'info');
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
      text: "This will reset search criteria and reload all hotel events.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotelSearchBookForm.reset();
        this.hotelSearchBookForm.patchValue({
          hotel_id: '',
          event_id: '',
          event_type_id: '',
          room_id: '',
          event_date: '',
        });
        this.getHotelEventBook();
        this.showAlert('Search filters cleared successfully.', 'success');
      }
    });
  }

  getHotelEventBook() {
    this.eventService.getHotelEvent().subscribe({
      next: (response: any) => {
        this.hotelsBooks = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  handleError(error: any) {
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

  updateHotelBook() {
    if (this.hotelEvent.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update this hotel event's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.formData = new FormData();
          this.hotelData = this.hotelEvent.getRawValue();

          this.eventService.updateHotelEvent(this.hotelData, this.hotelData.id).subscribe({
            next: (response: any) => {
              this.getHotelEventBook();
              this.clearForm();

              const updatedFields: string[] = [];
              Object.keys(this.hotelEvent.controls).forEach(key => {
                const control = this.hotelEvent.get(key);
                if (control && control.dirty) {
                  const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  updatedFields.push(formattedName);
                }
              });

              const eventNo = response?.event_no || this.hotelData.event_no || 'Event';
              if (updatedFields.length > 0) {
                this.showAlert(`Hotel event "${eventNo}" updated successfully. Updated fields: ${updatedFields.join(', ')}`, 'success');
              } else {
                this.showAlert(`Hotel event "${eventNo}" updated successfully.`, 'success');
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
      this.hotelEvent.markAllAsTouched();
    }
  }

  clearForm() {
    this.hotelEvent.reset();
    this.hotelEvent.patchValue({
      organizer_id: this.organizer_id
    });
  }

  ngOnInit(): void {
    this.hotelEvent.patchValue({
      organizer_id: this.organizer_id
    });

    this.hotelEvent.get('organizer_id')?.disable();
    this.hotelEvent.get('event_no')?.disable();

    this.getOrganizer();
    this.getRm();
    this.getHotel();
    this.getBookStatus();
    this.getEventTypes();
    this.getEvent();
    this.getHotelEventBook();
    this.getPackage();
  }

  getRm() {
    this.allServe.getRoom().subscribe({
      next: (response: any) => {
        this.rooms = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getHotel() {
    this.hotelServe.getHotel().subscribe({
      next: (response: any) => {
        this.hotels = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  onSubmit() {
    if (this.hotelEvent.valid) {
      this.hotelData = this.hotelEvent.getRawValue();

      this.eventService.submitHotelEvent(this.hotelData).subscribe({
        next: (response: any) => {
          this.getHotelEventBook();
          this.clearForm();
          this.showAlert('Event created successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.hotelEvent.markAllAsTouched();
    }
  }

  deleteHotelBook(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this hotel event deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteHotelEvent(id).subscribe({
          next: (data: any) => {
            this.getHotelEventBook();
            this.showAlert('Hotel event deleted successfully!', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  getHotelBookById(id: any) {
    this.eventService.getHotelEventById(id).subscribe({
      next: (data: any) => {
        this.hotelEvent.patchValue({
          ...data,
          event_date: data.event_date
            ? new Date(data.event_date).toISOString().split('T')[0]
            : null
        });
        this.showAlert('Hotel event details loaded for updating.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
}
