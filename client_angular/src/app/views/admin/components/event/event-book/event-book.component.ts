import {Component, OnInit} from '@angular/core';
import {
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective, FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IconDirective} from "@coreui/icons-angular";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {EventService} from "../../../../../services/event.service";
import {RestaurantEventComponent} from "../restaurant-event/restaurant-event.component";

@Component({
  selector: 'app-event-book',
  standalone: true,
  imports: [
    ButtonDirective,
    ColComponent,
    DatePipe,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    FormsModule,
    IconDirective,
    NgForOf,
    NgIf,
    NgbInputDatepicker,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    RestaurantEventComponent
  ],
  templateUrl: './event-book.component.html',
  styleUrl: './event-book.component.scss'
})
export class EventBookComponent implements OnInit {
  eventBook:FormGroup;
  searchEventBookForm:FormGroup;
  public error=null;
  rooms: any[] = [];
  organizers: any[] = [];
  selectedOrganizer: any = null;
  selectedEvent: string | null = null;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private eventService: EventService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {

    this.eventBook = this.fb.group({

      id: [''],
      r_id: ['', [Validators.required]],
      booking_no: [''],
      guest_id: ['', [Validators.required]],
      organizer_id: ['', [Validators.required]],
      r_book: ['', [Validators.required]],
      booking_Date: ['', [Validators.required]],
      cancel_Date: ['',[Validators.required]],
    });

    this.searchEventBookForm  = this.fb.group({
      search_booking_Date: [''],
      search_r_id: [''],
    });
  }

 handleError(error: { error: null; }){
    return  this.error=error.error;
  }

  clearForm() {
    this.eventBook.reset();
  }

  ngOnInit() {
    this.getOrganizer();
  }

  showEvent(event: string): void {
    this.selectedEvent = event;
  }

  back(): void {
    this.selectedEvent = null;
  }
  onOrganizerChange(event: any): void {
    const organizerId = event.target.value;

    this.selectedOrganizer = this.organizers.find(
      (organizer: any) => organizer.id == organizerId
    );
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
  objectValues(obj: any): any[] {
    return Object.values(obj);
  }
}
