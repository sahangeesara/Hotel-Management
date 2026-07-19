import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {HotelService} from "../../../../../services/hotel.service";
import {EventService} from "../../../../../services/event.service";
import {ToastrService} from "ngx-toastr";
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent
} from "@coreui/angular";
import {NgForOf} from "@angular/common";

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
    ButtonDirective
  ],
  templateUrl: './hotel-event.component.html',
  styleUrl: './hotel-event.component.scss'
})
export class HotelEventComponent {
  organizers:any[] = [];
  hotelEvent:FormGroup;
  formData = new FormData();
  @Input() organizer_id!: number;
  rooms: any[] = [];
  hotels: any[] = [];
  bookStatus: any[] = [];
  events: any[] = [];
  eventTypes: any[] = [];

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
        this.bookStatus = response.data;
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
  clearForm() {
    this.hotelEvent.reset();
  }
  ngOnInit(): void {
    this.hotelEvent.patchValue({
      organizer_id: this.organizer_id
    });

    this.hotelEvent.get('organizer_id')?.disable();
    this.getOrganizer();
    this.getRm();
    this.getHotel();
    this.getBookStatus();
    this.getEventTypes();
    this.getEvent();
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

  }
}
