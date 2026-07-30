import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {
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
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-wedding-event',
  standalone: true,
  imports: [
    NgForOf,
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
  statuses: any[] = [];
  @Input() organizer_id!: number;
  weddingEvents: any[] = [];
  weddingData: any;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private hotelServe: HotelService,
                 private eventService: EventService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {
    this.weddingForm = this.fb.group({
      event_no : [''],
      bride_name: ['', Validators.required],
      groom_name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      event_date: ['', Validators.required],
      event_time: ['', Validators.required],
      passengers: ['', Validators.required],
      hotel_id: ['', Validators.required],
      room_id: ['', Validators.required],
      organizer_id: ['', Validators.required],
      additional_services: [''],
      requests: [''],
      book_status_id: ['', Validators.required]

    });

    this.weddingSearchBookForm = this.fb.group({
      hotel_id: [''],
      room_id: [''],
      event_date: [''],
    })
  }
  getOrganizer() {
    this.eventService.getOrganizer().subscribe(
      (response: any) => {
        this.organizers = response.data;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }

  getBookStatus() {
    this.allServe.getBookStatus().subscribe(
      (response: any) => {
        this.statuses = response;
      },
      (error) => {
        console.error('Error fetching Book Status:', error);
      }
    );
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

  search() {
    const filters = {
      hotel_id: this.weddingSearchBookForm.get('hotel_id')?.value?.trim() || '',
      room_id: this.weddingSearchBookForm.get('room_id')?.value?.trim() || '',
      event_date: this.weddingSearchBookForm.get('event_date')?.value?.trim() || '',

    }

    if (!filters.hotel_id  && !filters.room_id && !filters.event_date) {
      this.getWeddingEventBook();
      return;
    }

    this.searchServe.getWeddingBookData(filters).subscribe({
      next: (data: any) => {
        this.weddingEvents = data;
      },
      error: (error) => {
        console.error('Error fetching wedding event:', error);
      }
    });
  }

  clearSearchForm() {
    this.weddingSearchBookForm.reset();
    this.getWeddingEventBook();
    this.weddingSearchBookForm.patchValue(
      {
        hotel_id: '',
        event_id: '',
        event_type_id: '',
        room_id: '',
        event_date: '',
      }
    )
  }


  getWeddingEventBook() {
    this.eventService.getWeddingEvent().subscribe(
      (response: any) => {
        this.weddingEvents = response.data;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }
  clearForm() {
    this.weddingForm.reset();
  }
  onSubmit(){
    if (this.weddingForm.valid) {
      this.weddingData = this.weddingForm.getRawValue();

      this.eventService.submitWeddingEvent(this.weddingData).subscribe(
        (response: any) => {
          this.getWeddingEventBook()
          this.toastr.success('Event Created Successfully', response.message,);
          this.clearForm();
        },
        (error) => {
          console.error('Error submitting event:', error);
        }
      )
    }
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
  }
}
