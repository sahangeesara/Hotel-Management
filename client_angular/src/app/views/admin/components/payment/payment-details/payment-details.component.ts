import {Component, Input, OnInit} from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent, ColComponent,
  FormLabelDirective,
  FormSelectDirective, RowComponent
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {Payment} from "../../../../../entities/payment";
import {PaymentService} from "../../../../../services/payment.service";
import {AllServiceService} from "../../../../../services/all-service.service";
import {EventService} from "../../../../../services/event.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [
    FormLabelDirective,
    FormSelectDirective,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent
  ],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.scss'
})
export class PaymentDetailsComponent implements OnInit {

  @Input() payment!: Payment;
  orderData: any[] = [];
  roomsBooks: any[] = [];
  guests: any[] = [];
  hotelsBooks: any[] = [];
  restaurantEventBooks: any[] = [];
  weddingEvents : any[] = [];
  payments: any[] = [];
  paymentMethods: any[] = [];
  paymentStatus: any[] = [];
  paymentForm:FormGroup;
  customers: any[] = [];
  organizers: any[] = [];

  constructor(private paymentService: PaymentService,
              private service: AllServiceService,
              private eventService: EventService,
              private fb: FormBuilder,
  )
  {
      this.paymentForm = this.fb.group({
        payment_id: [''],
        customer_id:[''],
        order_id: [''],
        guest_id: [''],
        room_book_id: [''],
        currencies_id: [''],
        organizer_id: [''],
        hotel_event_id: [''],
        restaurant_event_id: [''],
        wedding_event_id: [''],
        payment_method_id: [''],
        payment_status_id: [''],
        amount: [''],
      })
  }

  getOrder() {
    this.service.getOrders().subscribe(
      (data: any) => {
        this.orderData = data;

      },
      (error) => {
        console.error('Error fetching Food:', error);
      }
    );
  }
    getRmBook() {
      this.service.getRoomBook().subscribe(
        (response: any) => {
          this.roomsBooks = response.data;
        },
        (error) => {
          console.error('Error fetching rooms Book:', error);
        }
      );
    }

  getOrganizer() {
    this.eventService.getOrganizer().subscribe((response: any) => { this.organizers = response.data;},
      (error) => { console.error('Error fetching supplier:', error); });
  }

  getGuest() {
    this.service.getGuests().subscribe(
      (response: any) => {
        this.guests = response.data;
      },
      (error) => {
        console.error('Error fetching Guest:', error);
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

  getPayment() {
    this.paymentService.paymentGetAll().subscribe(
      (response: any) => {
        this.payments = response.data;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }

  getCustom() {
    this.service.getCustomer().subscribe((response: any) => { this.customers = response.data;},
      (error) => { console.error('Error fetching supplier:', error); });
  }
   getPaymentStatus() {
    this.paymentService.paymentStatus().subscribe(
      (response: any) => {
        this.paymentStatus = response;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }

  getPaymentMethod() {
    this.paymentService.paymentMethod().subscribe(
      (response: any) => {
        this.paymentMethods = response;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }


  ngOnInit(): void {
      this.getOrder();
      this.getCustom();
      this.getHotelEventBook();
      this.getRmBook();
      this.getGuest();
      this.getRestaurantEventBook();
      this.getWeddingEventBook();
      this.getPayment();
      this.getPaymentMethod();
      this.getPaymentStatus();
      this.getOrganizer();
  }

  onSubmit(){

  }

}
