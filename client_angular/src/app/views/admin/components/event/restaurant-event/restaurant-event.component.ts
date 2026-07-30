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
  ReactiveFormsModule, Validators,
} from "@angular/forms";
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormTextDirective,
  RowComponent,
  TableDirective
} from "@coreui/angular";
import {DatePipe, NgForOf} from "@angular/common";
import {HotelService} from "../../../../../services/hotel.service";
import {IconDirective} from "@coreui/icons-angular";
import {update} from "lodash-es";

@Component({
  selector: 'app-restaurant-event',
  standalone: true,
  imports: [FormControlDirective,
    FormsModule, ColComponent, RowComponent, ReactiveFormsModule, FormSelectDirective, FormLabelDirective, NgForOf, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, DatePipe, TableDirective, IconDirective, FormDirective],
  templateUrl: './restaurant-event.component.html',
  styleUrl: './restaurant-event.component.scss'
})
export class RestaurantEventComponent implements OnInit {

  organizers:any[] = [];
  restaurantEvent:FormGroup;
  restaurentSearchBookForm:FormGroup;
  formData = new FormData();
  @Input() organizer_id!: number;
  rooms: any[] = [];
  hotels: any[] = [];
  sections: any[] = [];
  bookStatus: any[] = [];
  events: any[] = [];
  eventTypes: any[] = [];
  restaurantData:any;
  restaurantEventBooks:any [] = [];
  private error: null | undefined;

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
      id:[''],
      event_no: [''],
      event_id: ['',[Validators.required]],
      event_type_id: ['',[Validators.required]],
      event_date: ['',[Validators.required]],
      start_time: ['',[Validators.required]],
      end_time: ['',[Validators.required]],
      passengers: ['',[Validators.required]],
      hotel_id: ['',[Validators.required]],
      room_id: ['',[Validators.required]],
      section_id: ['',[Validators.required]],
      seating_preferences: [''],
      organizer_id: ['',[Validators.required]],
      book_status_id: ['',[Validators.required]],
      requests: [''],
      additional_services: [''],
    });

    this.restaurentSearchBookForm = this.fb.group({
      hotel_id: [''],
      event_id: [''],
      event_type_id: [''],
      room_id: [''],
      event_date: [''],
    });
  }

  search() {
    const filters = {
      hotel_id: this.restaurentSearchBookForm.get('hotel_id')?.value?.trim() || '',
      event_id: this.restaurentSearchBookForm.get('event_id')?.value?.trim() || '',
      event_type_id: this.restaurentSearchBookForm.get('event_type_id')?.value?.trim() || '',
      room_id: this.restaurentSearchBookForm.get('room_id')?.value?.trim() || '',
      event_date: this.restaurentSearchBookForm.get('event_date')?.value?.trim() || '',

    };

    if (!filters.hotel_id && !filters.event_id && !filters.event_type_id && !filters.room_id && !filters.event_date) {
      this.getRestaurantEventBook();
      return;
    }

    this.searchServe.getRestaurantBookData(filters).subscribe({
      next: (data: any) => {
        this.restaurantEventBooks = data;
      },
      error: (error) => {
        console.error('Error fetching restaurant event:', error);
      }
    });
  }

  clearSearchForm() {
    this.restaurentSearchBookForm.reset();
    this.getRestaurantEventBook();
    this.restaurentSearchBookForm.patchValue(
      {
        hotel_id: '',
        event_id: '',
        event_type_id: '',
        room_id: '',
        event_date: '',
      }
    )
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
  clearForm() {
    this.restaurantEvent.reset();
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
  getRestaurantEventBook() {
    this.eventService.getRestaurantEvent().subscribe(
      (response: any) => {
        this.restaurantEventBooks = response.data;
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
    this.restaurantData = this.restaurantEvent.getRawValue();

    this.eventService.submitRestaurantEvent( this.restaurantData).subscribe(
      (response: any) => {
        this.getRestaurantEventBook()
        this.toastr.success('Event Created Successfully',response.message,);
        this.clearForm();
      },
      (error) => {
        console.error('Error submitting event:', error);
      }
    )
  }

  handleError(error: { error: null; }){
    return  this.error=error.error;
  }
  updateRmBook(){
    this.formData = new FormData();
    if (this.restaurantEvent.valid) {

      this.restaurantData = this.restaurantEvent.getRawValue();

      this.eventService.updateRestaurantEvent(this.restaurantData, this.restaurantData.id).subscribe(
        (response) => {
          this.getRestaurantEventBook()
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }
  deleteRmBook(id: any) {
    this.eventService.deleteRestaurantEvent(id).subscribe(
      (data: any) => {
        this.getRestaurantEventBook()
      },
      (error) => {
        console.error('Error fetching Restaurant Event:', error);
      }
    );
  }


  getRmBookById(id: any) {
    this.eventService.getRestaurantEventById(id).subscribe(
      (data: any) => {
        this.restaurantEvent.patchValue({
          ...data,
          event_date: data.event_date
            ? new Date(data.event_date).toISOString().split('T')[0]
            : null
        });
      },
      (error) => {
        console.error('Error fetching restaurant event:', error);
      }
    );
  }

}
