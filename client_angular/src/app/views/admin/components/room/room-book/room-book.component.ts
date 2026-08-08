import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  FormTextDirective,
  RowComponent,
  TableDirective,
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {IconDirective} from "@coreui/icons-angular";
import {SearchService} from "../../../../../services/search.service";
import {HotelService} from "../../../../../services/hotel.service";

@Component({
  selector: 'app-room-book',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    FormSelectDirective,
    NgForOf,
    NgIf,
    NgbInputDatepicker,
    IconDirective,
    DatePipe,
    FormTextDirective,
  ],
  templateUrl: './room-book.component.html',
  styleUrl: './room-book.component.scss'
})
export class RoomBookComponent implements OnInit {

  guests: any[] = [];
  rooms: any[] = [];
  packages: any[] = [];
  roomsBooks: any[] = [];
  booksRooms: any[] = [];
  roomCategories: any[] = [];
  hotels: any[] = [];
  selectedHotelName: string = '';
  availableRooms: any[] = [];  public error = null;
  formData = new FormData();
  rmBookForm: FormGroup;
  rmSearchBookForm: FormGroup;
  roomData: any;
  isVisible: boolean = false;
  totalAmount: any;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private allServe: AllServiceService,
    private hotelServes: HotelService,
    private searchServe: SearchService,
    private fb: FormBuilder,
  ) {
    this.rmBookForm = this.fb.group({
      id: [''],
      booking_no: [''],
      guest_id: ['', [Validators.required]],
      hotel_id: ['', [Validators.required]],
      package_id: ['', [Validators.required]],
      r_book: ['', [Validators.required]],
      max_guests: ['', [Validators.required]],
      number_of_room: ['', [Validators.required]],
      booking_Date: ['', [Validators.required]],
      cancel_Date: ['', [Validators.required]],
      additional_services: [''],
      room_category_id: [''],
      no_of_rooms: [''],
    }, { validators: RoomBookComponent.dateValidator });

    this.rmSearchBookForm = this.fb.group({
      search_booking_Date: [''],
      guest_id: [''],
      package_id: [''],
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

  static dateValidator(group: FormGroup) {
    const bookingDate = group.get('booking_Date')?.value;
    const cancelDate = group.get('cancel_Date')?.value;

    if (bookingDate && cancelDate) {
      const booking = new Date(bookingDate);
      const cancel = new Date(cancelDate);

      if (cancel < booking) {
        return { cancelDateInvalid: true };
      }
    }
    return null;
  }

  clearForm() {
    this.rmBookForm.reset();
    this.booksRooms = [];
    this.availableRooms = [];
    this.isVisible = false;
    this.rmBookForm.get('r_book')?.setValue('Booking');
    this.rmBookForm.get('booking_no')?.enable();
  }

  search() {
    const filters = {
      search_booking_Date: this.rmSearchBookForm.get('search_booking_Date')?.value?.trim() || '',
      guest_id: this.rmSearchBookForm.get('guest_id')?.value?.trim() || '',
      package_id: this.rmSearchBookForm.get('package_id')?.value?.trim() || '',
    };

    if (!filters.search_booking_Date && !filters.guest_id && !filters.package_id) {
      this.getRmBook();
      return;
    }

    this.searchServe.getRoomBookData(filters).subscribe({
      next: (data: any) => {
        this.roomsBooks = data;
        if (data.length === 0) {
          this.showAlert('No records found for the given search criteria.', 'info');
        }
      },
      error: (error) => {
        this.showAlert('Failed to search room bookings.', 'danger');
      }
    });
  }

  clearSearchForm() {
    this.rmSearchBookForm.reset();
    this.getRmBook();
    this.rmSearchBookForm.patchValue({
      search_booking_Date: '',
      guest_id: '',
      package_id: '',
    });
  }

  selectValue(event: any) {
    const id = event.target.value;
    this.allServe.getGuestById(id).subscribe(
      (guest: any) => {
        const max_guests = guest.booking_guest_counts?.[0]?.total_amount ?? 0;
        this.rmBookForm.patchValue({ max_guests: max_guests });
      },
      (error) => {
        this.showAlert('Failed to fetch guest details.' + error, 'danger');
      }
    );
  }
  getHotelById() {
    const hotelId = this.rmBookForm.get('hotel_id')?.value;

    if (!hotelId) {
      this.availableRooms = [];
      this.selectedHotelName = '';
      return;
    }

    // Find the hotel name from your already loaded hotels array
    const currentHotel = this.hotels.find((h: any) => h.id == hotelId);
    this.selectedHotelName = currentHotel ? currentHotel.name : '';

    // Fetch available rooms for this specific hotel from your service
    this.hotelServes.getRoomByHotelId(hotelId).subscribe({
      next: (response: any) => {
          this.availableRooms = response.data || response;

      },
      error: (error) => {
        this.handleError(error);
        this.availableRooms = [];
      }
    });
  }
  onSubmit() {
    if (this.rmBookForm.invalid) {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.rmBookForm.markAllAsTouched();
      return;
    }

    this.roomData = this.rmBookForm.getRawValue();
    let data = this.booksRooms;

    if (data.length === 0) {
      this.showAlert('Please add at least one room category to the booking.', 'warning');
      return;
    }

    this.formData = new FormData();
    if (this.roomData.booking_Date && typeof this.roomData.booking_Date === 'object') {
      this.roomData.booking_Date = this.formatDate(this.roomData.booking_Date);
    }
    if (this.roomData.cancel_Date && typeof this.roomData.cancel_Date === 'object') {
      this.roomData.cancel_Date = this.formatDate(this.roomData.cancel_Date);
    }

    this.formData.append('form', JSON.stringify(this.roomData));
    this.formData.append('room', JSON.stringify(data));

    this.allServe.submitRoomsBook(this.formData).subscribe({
      next: (data) => {
        this.getRm();
        this.getRmBook();
        this.clearForm();
        this.showAlert('Room booking created successfully!', 'success');
      },
      error: (error) => {
        this.handleError(error);
        this.showAlert('Failed to create room booking.', 'danger');
      }
    });
  }

  getPackage() {
    this.hotelServes.getPackage().subscribe(
      (response: any) => { this.packages = response; },
      (error) => {
        this.handleError(error);
      }
    );
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
      // @ts-ignore
      this.error = 'An unexpected error occurred.';
    }

    // Display it using your CoreUI alert
    // @ts-ignore
    this.showAlert(this.error, 'danger');
  }

  formatDate(obj: any) {
    const month = String(obj['month']).padStart(2, '0');
    const day = String(obj['day']).padStart(2, '0');
    return `${obj['year']}-${month}-${day}`;
  }

  getGuest() {
    this.allServe.getGuests().subscribe(
      (response: any) => { this.guests = response.data; },
      (error) => { this.handleError(error); }
    );
  }

  getRm() {
    this.allServe.getRoom().subscribe(
      (response: any) => { this.rooms = response.data; },
      (error) => { this.handleError(error); }
    );
  }

  getRmCat() {
    this.allServe.getRoomsCategory().subscribe(
      (response: any) => { this.roomCategories = response.data; },
      (error) => { this.handleError(error); }
    );
  }

  updateTotalAmount() {
    this.totalAmount = this.booksRooms.reduce(
      (total: number, room: any) => total + Number(room.no_of_rooms || 0),
      0
    );
    this.rmBookForm.controls['number_of_room'].setValue(this.totalAmount);
  }

  addSelectedRoom() {
    const selectedRoomCategoryId = this.rmBookForm.get('room_category_id')?.value;
    const roomsCount = this.rmBookForm.get('no_of_rooms')?.value;
    const numberOfRooms = Number(roomsCount);

    if (!selectedRoomCategoryId) {
      this.showAlert('Please select a room category.', 'warning');
      return;
    }

    if (numberOfRooms <= 0 || isNaN(numberOfRooms)) {
      this.showAlert('Please enter a valid room count.', 'warning');
      return;
    }

    const room = this.roomCategories.find(
      (r: any) => String(r.id) === String(selectedRoomCategoryId)
    );

    if (!room) {
      this.showAlert('Selected room category not found.', 'danger');
      return;
    }

    this.allServe.getRoomCategoryById(selectedRoomCategoryId).subscribe({
      next: (roomCat: any) => {
        const existing = this.booksRooms.find(
          (r: any) => String(r.room_category_id) === String(selectedRoomCategoryId)
        );

        if (existing) {
          existing.no_of_rooms += numberOfRooms;
        } else {
          this.booksRooms.push({
            ...room,
            room_category_id: selectedRoomCategoryId,
            name: roomCat.name,
            no_of_rooms: numberOfRooms
          });
        }

        this.rmBookForm.patchValue({ room_category_id: '', no_of_rooms: '' });
        this.updateTotalAmount();
        this.showAlert('Room added to list.', 'success');
      },
      error: (err) => {
        this.handleError(err);
        this.showAlert('Failed to load room category details.', 'danger');
      }
    });
  }

  removeRoom(index: number) {
    this.booksRooms.splice(index, 1);
    this.updateTotalAmount();
    this.showAlert('Room removed from list.', 'info');
  }

  deleteRmBook(id: any) {
    this.allServe.deleteRoomBook(id).subscribe({
      next: (data: any) => {
        this.getRmBook();
        this.getRm();
        this.showAlert('Room booking deleted successfully!', 'success');
      },
      error: (error) => {
        this.handleError(error);
        this.showAlert('Failed to delete room booking.', 'danger');
      }
    });
  }

  getRmBook() {
    this.allServe.getRoomBook().subscribe(
      (response: any) => { this.roomsBooks = response.data; },
      (error) => {
        this.showAlert('Failed to get room booking.', 'danger');
        this.handleError(error);
      }
    );
  }

  getRmBookById(id: any) {
    this.allServe.getRoomBookById(id).subscribe({
      next: (response: any) => {
        this.rmBookForm.patchValue({
          ...response,
          booking_Date: response.booking_Date ? new Date(response.booking_Date).toISOString().split('T')[0] : null,
          cancel_Date: response.cancel_Date ? new Date(response.cancel_Date).toISOString().split('T')[0] : null
        });

        this.booksRooms = response.booking_rooms.map((room: any) => ({
          room_category_id: room.room_category_id,
          name: room.room_category?.name,
          no_of_rooms: room.no_of_rooms
        }));

        this.isVisible = true;
        this.rmBookForm.get('booking_no')?.disable();
        this.showAlert('Booking details loaded for editing.', 'info');
      },
      error: (error) => {
        this.handleError(error);
        this.showAlert('Failed to load booking details.', 'danger');
      }
    });
  }

  updateRmBook() {
    if (!this.rmBookForm.valid) {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      return;
    }

    const roomData = this.rmBookForm.getRawValue();

    if (roomData.booking_Date && typeof roomData.booking_Date === 'object') {
      roomData.booking_Date = this.formatDate(roomData.booking_Date);
    }
    if (roomData.cancel_Date && typeof roomData.cancel_Date === 'object') {
      roomData.cancel_Date = this.formatDate(roomData.cancel_Date);
    }

    const formData = new FormData();
    formData.append('form', JSON.stringify(roomData));
    formData.append('room', JSON.stringify(this.booksRooms));
    formData.append('_method', 'PATCH');

    this.allServe.updateRoomBook(formData, roomData.id).subscribe({
      next: (response) => {
        this.getRm();
        this.getRmBook();
        this.clearForm();
        this.showAlert('Room booking updated successfully!', 'success');
      },
      error: (error) => {
        console.error('Update error:', error);
        this.handleError(error);
        this.showAlert('Failed to update room booking.', 'danger');
      }
    });
  }

  getHotel() {
    this.hotelServes.getHotel().subscribe(
      (response: any) => { this.hotels = response.data; },
      (error) => {
        this.handleError(error);
        this.showAlert('Error fetching hotel', 'danger');

      }
    );
  }

  downloadPDF() {
    this.allServe.downloadRoomBookPDF().subscribe({
      next: (response: any) => {
        let blob = new Blob([response], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "room-book-report.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
        this.showAlert('PDF report downloaded successfully.', 'success');
      },
      error: (error) => {
        this.handleError(error);
        this.showAlert('Failed to download PDF report.', 'danger');
      }
    });
  }

  downloadExcel() {
    this.allServe.downloadRoomBookExcel().subscribe({
      next: (response: any) => {
        let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "room-book-report.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
        this.showAlert('Excel report downloaded successfully.', 'success');
      },
      error: (error) => {
        this.handleError(error);
        this.showAlert('Failed to download Excel report.', 'danger');
      }
    });
  }

  ngOnInit() {
    this.getRmBook();
    this.getRm();
    this.getGuest();
    this.getPackage();
    this.getRmCat();
    this.getHotel();

    this.rmBookForm.get('r_book')?.setValue('Booking');
    this.rmBookForm.get('r_book')?.disable();
  }
}
