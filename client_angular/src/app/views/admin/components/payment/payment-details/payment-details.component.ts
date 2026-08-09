import { Component, Input, OnInit } from '@angular/core';

import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent,
  TableDirective
} from '@coreui/angular';

import { NgForOf, NgIf, DatePipe } from '@angular/common';

import { Payment } from '../../../../../entities/payment';
import { PaymentService } from '../../../../../services/payment.service';
import { AllServiceService } from '../../../../../services/all-service.service';
import { EventService } from '../../../../../services/event.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-details',
  standalone: true,

  imports: [
    AlertComponent,
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
    CardBodyComponent,
    TableDirective,
    FormControlDirective
  ],

  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.scss'
})
export class PaymentDetailsComponent implements OnInit {

  @Input() payment: Payment | null = null;

  // Related Records
  relatedRecords: any = {
    room_bookings: [],
    orders: [],
    hotel_events: [],
    restaurant_events: [],
    wedding_events: []
  };

  // Dropdown Data
  orderData: any[] = [];
  roomsBooks: any[] = [];
  guests: any[] = [];
  hotelsBooks: any[] = [];
  restaurantEventBooks: any[] = [];
  weddingEvents: any[] = [];

  paymentMethods: any[] = [];
  paymentStatus: any[] = [];

  customers: any[] = [];
  organizers: any[] = [];

  // Form
  paymentForm: FormGroup;

  // Selected Person
  selectedPersonType: string = '';
  selectedPersonId: number | null = null;

  // Error/Alert variables
  public error: any = null;
  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(
    private paymentService: PaymentService,
    private service: AllServiceService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      payment_no: [''],
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
      amount: ['']
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

  private getArray(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  onPersonChange(
    type: 'guest' | 'customer' | 'organizer',
    event: any
  ): void {
    const id = event?.target?.value;

    this.paymentForm.get('organizer_id')?.disable();
    this.paymentForm.get('customer_id')?.disable();
    this.paymentForm.get('guest_id')?.disable();

    if (type === 'organizer') {
      this.paymentForm.get('organizer_id')?.enable();
    }
    if (type === 'customer') {
      this.paymentForm.get('customer_id')?.enable();
    }
    if (type === 'guest') {
      this.paymentForm.get('guest_id')?.enable();
    }

    if (!id || id === '') {
      this.selectedPersonType = '';
      this.selectedPersonId = null;
      this.payment = null;
      this.resetRelatedRecords();
      return;
    }

    this.selectedPersonType = type;
    this.selectedPersonId = Number(id);

    this.fetchPersonDetails(type, Number(id));
  }

  fetchPersonDetails(
    type: string,
    id: number
  ): void {
    this.paymentService
      .getPaymentByPerson(type, id)
      .subscribe({
        next: (response: any) => {
          this.payment = response?.data ?? null;
          const records = response?.related_records;

          this.relatedRecords = {
            room_bookings: Array.isArray(records?.room_bookings) ? records.room_bookings : [],
            orders: Array.isArray(records?.orders) ? records.orders : [],
            hotel_events: Array.isArray(records?.hotel_events) ? records.hotel_events : [],
            restaurant_events: Array.isArray(records?.restaurant_events) ? records.restaurant_events : [],
            wedding_events: Array.isArray(records?.wedding_events) ? records.wedding_events : []
          };

          if (
            response?.data &&
            response.data.amount !== null &&
            response.data.amount !== undefined
          ) {
            this.paymentForm.patchValue({
              amount: response.data.amount
            });
          }
        },
        error: (error) => {
          console.error('Error fetching payment details:', error);
          this.payment = null;
          this.resetRelatedRecords();
          this.handleError(error);
        }
      });
  }

  private resetRelatedRecords(): void {
    this.relatedRecords = {
      room_bookings: [],
      orders: [],
      hotel_events: [],
      restaurant_events: [],
      wedding_events: []
    };
  }

  downloadPaymentPdf(): void {

    if (!this.selectedPersonType || !this.selectedPersonId) {
      this.showAlert(
        'Please select a guest, customer, or organizer first.',
        'warning'
      );
      return;
    }

    this.paymentService
      .downloadPdf(
        this.selectedPersonType,
        this.selectedPersonId
      )
      .subscribe({
        next: (response: Blob) => {


          if (!response || response.size === 0) {
            this.showAlert(
              'The PDF file is empty.',
              'danger'
            );
            return;
          }

          const blob = new Blob(
            [response],
            {
              type: 'application/pdf'
            }
          );

          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');

          link.href = url;

          link.download =
            `${this.selectedPersonType}-payment-report.pdf`;

          // Important for some browsers
          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);

          // Give browser time to start download
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);

          this.showAlert(
            'PDF report downloaded successfully.',
            'success'
          );
        },

        error: (error) => {

          console.error(
            'Error downloading PDF:',
            error
          );

          this.showAlert(
            'Failed to download PDF report.',
            'danger'
          );
        }
      });
  }


  getOrder(): void {
    this.service.getOrders().subscribe({
      next: (res: any) => {
        this.orderData = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.orderData = [];
      }
    });
  }

  getRmBook(): void {
    this.service.getRoomBook().subscribe({
      next: (res: any) => {
        this.roomsBooks = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading room bookings:', error);
        this.roomsBooks = [];
      }
    });
  }

  getOrganizer(): void {
    this.eventService.getOrganizer().subscribe({
      next: (res: any) => {
        this.organizers = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading organizers:', error);
        this.organizers = [];
      }
    });
  }

  getGuest(): void {
    this.service.getGuests().subscribe({
      next: (res: any) => {
        this.guests = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading guests:', error);
        this.guests = [];
      }
    });
  }

  getRestaurantEventBook(): void {
    this.eventService.getRestaurantEvent().subscribe({
      next: (res: any) => {
        this.restaurantEventBooks = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading restaurant events:', error);
        this.restaurantEventBooks = [];
      }
    });
  }

  getHotelEventBook(): void {
    this.eventService.getHotelEvent().subscribe({
      next: (res: any) => {
        this.hotelsBooks = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading hotel events:', error);
        this.hotelsBooks = [];
      }
    });
  }

  getWeddingEventBook(): void {
    this.eventService.getWeddingEvent().subscribe({
      next: (res: any) => {
        this.weddingEvents = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading wedding events:', error);
        this.weddingEvents = [];
      }
    });
  }

  getCustom(): void {
    this.service.getCustomer().subscribe({
      next: (res: any) => {
        this.customers = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.customers = [];
      }
    });
  }

  getPaymentStatus(): void {
    this.paymentService.paymentStatus().subscribe({
      next: (res: any) => {
        this.paymentStatus = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading payment status:', error);
        this.paymentStatus = [];
      }
    });
  }

  getPaymentMethod(): void {
    this.paymentService.paymentMethod().subscribe({
      next: (res: any) => {
        this.paymentMethods = this.getArray(res);
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.paymentMethods = [];
      }
    });
  }

  handleError(error: any) {
    console.error('Backend Error:', error);

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

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (!this.selectedPersonType || !this.selectedPersonId) {
      this.showAlert('Please select a Guest, Customer, or Organizer.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Save Payment?',
      text: "Do you want to save this payment record?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formValues = this.paymentForm.getRawValue();
        const payload: any = {
          ...formValues,
          payment_type: this.selectedPersonType,
          is_active: true
        };

        if (this.selectedPersonType === 'guest') {
          payload.guest_id = this.selectedPersonId;
          payload.customer_id = null;
          payload.organizer_id = null;
        }

        if (this.selectedPersonType === 'customer') {
          payload.customer_id = this.selectedPersonId;
          payload.guest_id = null;
          payload.organizer_id = null;
        }

        if (this.selectedPersonType === 'organizer') {
          payload.organizer_id = this.selectedPersonId;
          payload.customer_id = null;
          payload.guest_id = null;
        }

        this.paymentService.paymentSubmit(payload).subscribe({
          next: (response: any) => {
            Swal.fire({
              title: 'Success!',
              text: 'Payment saved successfully!',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });

           this.clearForm();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  clearForm(): void {
    this.payment = null;
    this.selectedPersonType = '';
    this.selectedPersonId = null;
    this.resetRelatedRecords();

    this.paymentForm.get('guest_id')?.enable();
    this.paymentForm.get('customer_id')?.enable();
    this.paymentForm.get('organizer_id')?.enable();
  }
}
