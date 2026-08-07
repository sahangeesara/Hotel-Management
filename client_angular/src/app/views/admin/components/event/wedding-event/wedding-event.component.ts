import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {HotelService} from "../../../../../services/hotel.service";
import {EventService} from "../../../../../services/event.service";

@Component({
  selector: 'app-wedding-event',
  standalone: true,
  imports: [
    AlertComponent,
    NgForOf,
    NgIf,
    TableDirective,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    ColComponent,
    FormsModule,
    RowComponent,
    ReactiveFormsModule,
    DatePipe,
    ButtonDirective,
    FormControlDirective,
    FormLabelDirective,
    FormDirective,
    FormSelectDirective
  ],
  templateUrl: './wedding-event.component.html',
  styleUrl: './wedding-event.component.scss'
})
export class WeddingEventComponent implements OnInit {
  weddingForm!: FormGroup;
  weddingSearchBookForm!: FormGroup;
  hotels: any[] = [];
  rooms: any[] = [];
  organizers: any[] = [];
  packages: any[] = [];
  statuses: any[] = [];
  @Input() organizer_id!: number;
  weddingEvents: any[] = [];
  weddingData: any;
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
    this.weddingForm = this.fb.group({
      event_no: [''],
      bride_name: ['', Validators.required],
      groom_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      event_date: ['', Validators.required],
      event_time: ['', Validators.required],
      passengers: ['', Validators.required],
      hotel_id: ['', Validators.required],
      room_id: ['', Validators.required],
      package_id: ['', Validators.required],
      organizer_id: ['', Validators.required],
      additional_services: [''],
      requests: [''],
      book_status_id: ['', Validators.required]
    });

    this.weddingSearchBookForm = this.fb.group({
      hotel_id: [''],
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
        this.statuses = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
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

  getHotels() {
    this.hotelServe.getHotel().subscribe({
      next: (response: any) => {
        this.hotels = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  search() {
    const filters = {
      hotel_id: this.weddingSearchBookForm.get('hotel_id')?.value?.trim() || '',
      room_id: this.weddingSearchBookForm.get('room_id')?.value?.trim() || '',
      event_date: this.weddingSearchBookForm.get('event_date')?.value?.trim() || '',
    };

    if (!filters.hotel_id && !filters.room_id && !filters.event_date) {
      this.getWeddingEventBook();
      return;
    }

    this.searchServe.getWeddingBookData(filters).subscribe({
      next: (data: any) => {
        this.weddingEvents = data;
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
    this.weddingSearchBookForm.reset();
    this.getWeddingEventBook();
    this.weddingSearchBookForm.patchValue({
      hotel_id: '',
      room_id: '',
      event_date: '',
    });
  }

  getWeddingEventBook() {
    this.eventService.getWeddingEvent().subscribe({
      next: (response: any) => {
        this.weddingEvents = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearForm() {
    this.weddingForm.reset();
    this.weddingForm.patchValue({
      organizer_id: this.organizer_id
    });
  }

  onSubmit() {
    if (this.weddingForm.valid) {
      this.weddingData = this.weddingForm.getRawValue();

      this.eventService.submitWeddingEvent(this.weddingData).subscribe({
        next: (response: any) => {
          this.getWeddingEventBook();
          this.clearForm();
          this.showAlert('Wedding event created successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.weddingForm.markAllAsTouched();
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

  ngOnInit(): void {
    this.weddingForm.patchValue({
      organizer_id: this.organizer_id
    });

    this.weddingForm.get('organizer_id')?.disable();
    this.weddingForm.get('event_no')?.disable();
    this.getOrganizer();
    this.getWeddingEventBook();
    this.getBookStatus();
    this.getHotels();
    this.getRm();
    this.getPackage();
  }
}
