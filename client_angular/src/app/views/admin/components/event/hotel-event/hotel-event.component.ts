import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {HotelService} from "../../../../../services/hotel.service";
import {EventService} from "../../../../../services/event.service";
import {ToastrService} from "ngx-toastr";
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {DatePipe, NgForOf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";

@Component({
  selector: 'app-hotel-event',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    FormLabelDirective,
    FormsModule,
    FormControlDirective,
    FormSelectDirective,
    NgForOf,
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
export class HotelEventComponent implements OnInit{
  organizers:any[] = [];
  hotelEvent:FormGroup;
  hotelSearchBookForm:FormGroup;
  formData = new FormData();
  @Input() organizer_id!: number;
  rooms: any[] = [];
  hotels: any[] = [];
  hotelsBooks: any[] = [];
  bookStatus: any[] = [];
  events: any[] = [];
  eventTypes: any[] = [];
  hotelData:any
  private error: null | undefined;
  constructor(
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private hotelServe: HotelService,
                 private eventService: EventService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {
    this.hotelEvent = this.fb.group({
      id:[''],
      event_no: [''],
      event_id: [''],
      event_type_id: [''],
      event_date: [''],
      start_time: [''],
      end_time: [''],
      passengers: [''],
      hotel_id: [''],
      room_id: [''],
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
        this.bookStatus = response;
      },
      (error) => {
        console.error('Error fetching Book Status:', error);
      }
    );
  }
  getEventTypes() {
    this.eventService.getEventType().subscribe(
      (response: any) => {
        this.eventTypes = response.data;
      },
      (error) => {
        console.error('Error fetching Event Type:', error);
      }
    );
  }
  getEvent() {
    this.eventService.getEvent().subscribe(
      (response: any) => {
        this.events = response;
      },
      (error) => {
        console.error('Error fetching Event:', error);
      }
    );
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
      },
      error: (error) => {
        console.error('Error fetching hotel event:', error);
      }
    });
  }

  clearSearchForm() {
    this.hotelSearchBookForm.reset();
    this.getHotelEventBook();
    this.hotelSearchBookForm.patchValue(
      {
        hotel_id: '',
        event_id: '',
        event_type_id: '',
        room_id: '',
        event_date: '',
      }
    )
  }
  getHotelEventBook() {
    this.eventService.getHotelEvent().subscribe(
      (response: any) => {
        this.hotelsBooks = response.data;
      },
      (error) => {
        console.error('Error fetching Event:', error);
      }
    );
  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }
  updateHotelBook(){
    this.formData = new FormData();
    if (this.hotelEvent.valid) {

      this.hotelData = this.hotelEvent.getRawValue();

      this.eventService.updateHotelEvent(this.hotelData, this.hotelData.id).subscribe(
        (response) => {
          this.getHotelEventBook()
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }

  clearForm() {
    this.hotelEvent.reset();
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
  getHotel() {
    this.hotelServe.getHotel().subscribe(
      (response: any) => {
        this.hotels = response.data;
      },
      (error) => {
        console.error('Error fetching hotel:', error);
      }
    );
  }

  onSubmit(){
    if (this.hotelEvent.valid) {
      this.hotelData = this.hotelEvent.getRawValue();

      this.eventService.submitHotelEvent(this.hotelData).subscribe(
        (response: any) => {
          this.getHotelEventBook();
          this.toastr.success('Event Created Successfully', response.message,);
          this.clearForm();
        },
        (error) => {
          console.error('Error submitting event:', error);
        }
      )
    }
  }


   deleteHotelBook(id:any) {
     this.eventService.deleteHotelEvent(id).subscribe(
       (data: any) => {
         this.getHotelEventBook()
       },
       (error) => {
         console.error('Error fetching Hotel Event:', error);
       }
     );
  }

  getHotelBookById(id:any) {
    this.eventService.getHotelEventById(id).subscribe(
      (data: any) => {
        this.hotelEvent.patchValue({
          ...data,
          event_date: data.event_date
            ? new Date(data.event_date).toISOString().split('T')[0]
            : null
        });
      },
      (error) => {
        console.error('Error fetching hotel event:', error);
      }
    );
  }
}
