import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {EventService} from "../../../../../services/event.service";
import {ToastrService} from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormTextDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import {NgForOf} from "@angular/common";
import {HotelService} from "../../../../../services/hotel.service";

@Component({
  selector: 'app-restaurant-event',
  standalone: true,
  imports: [FormControlDirective,
    FormsModule, ColComponent, RowComponent, ReactiveFormsModule, FormSelectDirective, FormLabelDirective, NgForOf, ButtonDirective],
  templateUrl: './restaurant-event.component.html',
  styleUrl: './restaurant-event.component.scss'
})
export class RestaurantEventComponent implements OnInit {
  organizers:any[] = [];
  restaurantEvent:FormGroup;
  formData = new FormData();
  @Input() organizer_id!: number;
  rooms: any[] = [];
  hotels: any[] = [];
  sections: any[] = [];
  bookStatus: any[] = [];
  events: any[] = [];
  eventTypes: any[] = [];

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private hotelServe: HotelService,
                 private eventService: EventService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {
    this.restaurantEvent = this.fb.group({
      event_no: [''],
      event_id: [''],
      event_type_id: [''],
      event_date: [''],
      start_time: [''],
      end_time: [''],
      passengers: [''],
      hotel_id: [''],
      room_id: [''],
      section_id: [''],
      seating_preferences: [''],
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
    this.restaurantEvent.reset();
  }
  ngOnInit(): void {
    this.restaurantEvent.patchValue({
      organizer_id: this.organizer_id
    });

    this.restaurantEvent.get('organizer_id')?.disable();
    this.getOrganizer();
    this.getRm();
    this.getSection();
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

  getSection() {
    this.hotelServe.getSections().subscribe(
      (response: any) => {
        this.sections = response.data;
      },
      (error) => {
        console.error('Error fetching sections:', error);
      }
    );
  }

  onSubmit(){

  }
}
