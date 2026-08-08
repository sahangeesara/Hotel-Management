import { Component, Input, OnInit } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent, ColComponent,
  FormLabelDirective,
  FormSelectDirective, RowComponent
} from "@coreui/angular";
import { NgForOf, NgIf, DatePipe } from "@angular/common";
import { Payment } from "../../../../../entities/payment";
import { PaymentService } from "../../../../../services/payment.service";
import { AllServiceService } from "../../../../../services/all-service.service";
import { EventService } from "../../../../../services/event.service";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [
    FormLabelDirective,
    FormSelectDirective,
    NgForOf,
    NgIf,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent
  ],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.scss'
})
export class PaymentDetailsComponent implements OnInit {

  @Input() payment!: Payment | null;
  orderData: any[] = [];
  roomsBooks: any[] = [];
  guests: any[] = [];
  hotelsBooks: any[] = [];
  restaurantEventBooks: any[] = [];
  weddingEvents: any[] = [];
  paymentMethods: any[] = [];
  paymentStatus: any[] = [];
  paymentForm: FormGroup;
  customers: any[] = [];
  organizers: any[] = [];

  selectedPersonType: string = '';
  selectedPersonId: number | null = null;

  constructor(
    private paymentService: PaymentService,
    private service: AllServiceService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      numberment_id: [''],
      customer_id: [''],
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
    });
  }

  ngOnInit(): void {
    this.getOrder();
    this.getCustom();
    this.getHotelEventBook();
    this.getRmBook();
    this.getGuest();
    this.getRestaurantEventBook();
    this.getWeddingEventBook();
    this.getPaymentMethod();
    this.getPaymentStatus();
    this.getOrganizer();
  }

  // Handle Person Selection Change (Guest, Customer, or Organizer)
  onPersonChange(type: 'guest' | 'customer' | 'organizer', event: any) {
    const id = event.target.value;

    // Reset other fields to maintain single-selection exclusivity
    if (type === 'guest') {
      this.paymentForm.patchValue({ customer_id: '', organizer_id: '' }, { emitEvent: false });
    } else if (type === 'customer') {
      this.paymentForm.patchValue({ guest_id: '', organizer_id: '' }, { emitEvent: false });
    } else if (type === 'organizer') {
      this.paymentForm.patchValue({ guest_id: '', customer_id: '' }, { emitEvent: false });
    }

    if (id) {
      this.selectedPersonType = type;
      this.selectedPersonId = id;
      this.fetchPersonDetails(type, id);
    } else {
      this.selectedPersonType = '';
      this.selectedPersonId = null;
      this.payment = null;
    }
  }

  // Fetch payment details for the selected person to display in the card below
  fetchPersonDetails(type: string, id: number) {
    this.paymentService.getPaymentByPerson(type, id).subscribe(
      (response: any) => {
        // Assuming response returns the payment object or list
        this.payment = response.data || response;
      },
      (error) => {
        console.error('Error fetching payment details:', error);
      }
    );
  }

  // Trigger PDF download for the selected person
  downloadPaymentPdf() {
    if (!this.selectedPersonType || !this.selectedPersonId) return;

    this.paymentService.downloadPdf(this.selectedPersonType, this.selectedPersonId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.selectedPersonType}-payment-report.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading PDF:', error);
      }
    );
  }

  // Other fetch methods...
  getOrder() { this.service.getOrders().subscribe((data: any) => this.orderData = data); }
  getRmBook() { this.service.getRoomBook().subscribe((res: any) => this.roomsBooks = res.data); }
  getOrganizer() { this.eventService.getOrganizer().subscribe((res: any) => this.organizers = res.data); }
  getGuest() { this.service.getGuests().subscribe((res: any) => this.guests = res.data); }
  getRestaurantEventBook() { this.eventService.getRestaurantEvent().subscribe((res: any) => this.restaurantEventBooks = res.data); }
  getHotelEventBook() { this.eventService.getHotelEvent().subscribe((res: any) => this.hotelsBooks = res.data); }
  getWeddingEventBook() { this.eventService.getWeddingEvent().subscribe((res: any) => this.weddingEvents = res.data); }
  getCustom() { this.service.getCustomer().subscribe((res: any) => this.customers = res.data); }
  getPaymentStatus() { this.paymentService.paymentStatus().subscribe((res: any) => this.paymentStatus = res); }
  getPaymentMethod() { this.paymentService.paymentMethod().subscribe((res: any) => this.paymentMethods = res); }

  onSubmit() {}
}
