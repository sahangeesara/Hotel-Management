import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {EventService} from "../../../../../services/event.service";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  AlertComponent,
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {HotelService} from "../../../../../services/hotel.service";
import {IconDirective} from "@coreui/icons-angular";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-event',
  standalone: true,
  imports: [
    AlertComponent,
    FormControlDirective,
    FormsModule,
    ColComponent,
    RowComponent,
    ReactiveFormsModule,
    FormSelectDirective,
    FormLabelDirective,
    NgForOf,
    NgIf,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    DatePipe,
    TableDirective,
    IconDirective,
    FormDirective
  ],
  templateUrl: './restaurant-event.component.html',
  styleUrl: './restaurant-event.component.scss'
})
export class RestaurantEventComponent implements OnInit {

  organizers: any[] = [];
  restaurantEvent: FormGroup;
  restaurantSearchBookForm: FormGroup;
  formData = new FormData();
  @Input() organizer_id!: number;
  rooms: any[] = [];
  hotels: any[] = [];
  sections: any[] = [];
  bookStatus: any[] = [];
  events: any[] = [];
  packages: any[] = [];
  eventTypes: any[] = [];
  restaurantData: any;
  restaurantEventBooks: any[] = [];
  public error: any = null;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private route: ActivatedRoute,
    private allServe: AllServiceService,
    private searchServe: SearchService,
    private hotelServe: HotelService,
    private eventService: EventService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.restaurantEvent = this.fb.group({
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
      section_id: [''],
      seating_preferences: [''],
      organizer_id: [''],
      book_status_id: [''],
      requests: [''],
      additional_services: [''],
    });

    this.restaurantSearchBookForm = this.fb.group({
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

  search() {
    const filters = {
      hotel_id: this.restaurantSearchBookForm.get('hotel_id')?.value?.trim() || '',
      event_id: this.restaurantSearchBookForm.get('event_id')?.value?.trim() || '',
      event_type_id: this.restaurantSearchBookForm.get('event_type_id')?.value?.trim() || '',
      room_id: this.restaurantSearchBookForm.get('room_id')?.value?.trim() || '',
      event_date: this.restaurantSearchBookForm.get('event_date')?.value?.trim() || '',
    };

    if (!filters.hotel_id && !filters.event_id && !filters.event_type_id && !filters.room_id && !filters.event_date) {
      this.getRestaurantEventBook();
      return;
    }

    this.searchServe.getRestaurantBookData(filters).subscribe({
      next: (data: any) => {
        this.restaurantEventBooks = data;
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
      text: "This will reset search criteria and reload all restaurant events.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restaurantSearchBookForm.reset();
        this.restaurantSearchBookForm.patchValue({
          hotel_id: '',
          event_id: '',
          event_type_id: '',
          room_id: '',
          event_date: '',
        });
        this.getRestaurantEventBook();
        this.showAlert('Search filters cleared successfully.', 'success');
      }
    });
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

  clearForm() {
    this.restaurantEvent.reset();
    this.restaurantEvent.patchValue({
      organizer_id: this.organizer_id
    });
  }

  ngOnInit(): void {
    this.restaurantEvent.patchValue({
      organizer_id: this.organizer_id
    });

    this.restaurantEvent.get('organizer_id')?.disable();
    this.restaurantEvent.get('event_no')?.disable();
    this.getOrganizer();
    this.getRm();
    this.getSection();
    this.getHotel();
    this.getBookStatus();
    this.getEventTypes();
    this.getEvent();
    this.getRestaurantEventBook();
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

  getRestaurantEventBook() {
    this.eventService.getRestaurantEvent().subscribe({
      next: (response: any) => {
        this.restaurantEventBooks = response.data;
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

  getSection() {
    this.hotelServe.getSections().subscribe({
      next: (response: any) => {
        this.sections = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  onSubmit() {
    if (this.restaurantEvent.valid) {
      Swal.fire({
        title: 'Create Restaurant Event?',
        text: "Do you want to save this new restaurant event booking?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, create it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.restaurantData = this.restaurantEvent.getRawValue();

          this.eventService.submitRestaurantEvent(this.restaurantData).subscribe({
            next: (response: any) => {
              this.getRestaurantEventBook();
              this.clearForm();
              this.showAlert('Restaurant event created successfully!', 'success');
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.restaurantEvent.markAllAsTouched();
    }
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

  updateRmBook() {
    if (this.restaurantEvent.valid) {
      Swal.fire({
        title: 'Update Restaurant Event?',
        text: "Do you want to update this restaurant event's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.formData = new FormData();
          this.restaurantData = this.restaurantEvent.getRawValue();

          this.eventService.updateRestaurantEvent(this.restaurantData, this.restaurantData.id).subscribe({
            next: (response: any) => {
              this.getRestaurantEventBook();
              this.clearForm();

              const updatedFields: string[] = [];
              Object.keys(this.restaurantEvent.controls).forEach(key => {
                const control = this.restaurantEvent.get(key);
                if (control && control.dirty) {
                  const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  updatedFields.push(formattedName);
                }
              });

              const eventNo = response?.event_no || this.restaurantData.event_no || 'Event';
              if (updatedFields.length > 0) {
                this.showAlert(`Restaurant event "${eventNo}" updated successfully. Updated fields: ${updatedFields.join(', ')}`, 'success');
              } else {
                this.showAlert(`Restaurant event "${eventNo}" updated successfully.`, 'success');
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
      this.restaurantEvent.markAllAsTouched();
    }
  }

  deleteRmBook(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this restaurant event deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteRestaurantEvent(id).subscribe({
          next: (data: any) => {
            this.getRestaurantEventBook();
            this.showAlert('Restaurant event deleted successfully!', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  getRmBookById(id: any) {
    this.eventService.getRestaurantEventById(id).subscribe({
      next: (data: any) => {
        this.restaurantEvent.patchValue({
          ...data,
          event_date: data.event_date
            ? new Date(data.event_date).toISOString().split('T')[0]
            : null
        });
        this.showAlert('Restaurant event details loaded for updating.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
}
