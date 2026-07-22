import {Component, OnInit} from '@angular/core';
import {
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
import {ToastrService} from "ngx-toastr";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {IconDirective} from "@coreui/icons-angular";
import {SearchService} from "../../../../../services/search.service";
import {HotelService} from "../../../../../services/hotel.service";


@Component({
  selector: 'app-room-book',
  standalone: true,
  imports: [
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
export class RoomBookComponent implements OnInit{

  guests: any[] = [];
  rooms: any[] = [];
  packages: any[] = [];
  roomsBooks: any[] = [];
  booksRooms: any[] = [];
  roomCategories: any[] = [];
  public error=null;
  formData = new FormData();
  rmBookForm: FormGroup;
  rmSearchBookForm: FormGroup;
  roomData:any;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private  hotelServes:HotelService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {

    this.rmBookForm = this.fb.group({

      id: [''],
      booking_no: [''],
      guest_id: ['', [Validators.required]],
      package_id: ['', [Validators.required]],
      r_book: ['', [Validators.required]],
      max_guests: ['', [Validators.required]],
      number_of_room: ['', [Validators.required]],
      booking_Date: ['', [Validators.required]],
      cancel_Date: ['',[Validators.required]],
      room_category_id: [''],
      no_of_rooms: [''],

    }, { validators: RoomBookComponent.dateValidator });

    this.rmSearchBookForm  = this.fb.group({
      search_booking_Date: [''],
      search_r_id: [''],

    });
  }

  //search form
  get rmBookSearchDateField(): FormControl {
    return this.rmSearchBookForm.controls['search_booking_Date'] as FormControl;
  }
  get rmBookSearchRIdField(): FormControl {
    return this.rmSearchBookForm.controls['search_r_id'] as FormControl;
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
    // @ts-ignore
    this.removeRoom()

  }

  onSubmit() {
    if (this.rmBookForm.valid) {
      this.roomData = this.rmBookForm.getRawValue();

      let data = this.booksRooms;

      this.formData = new FormData();
// Format dates from NgbDatepicker format to YYYY-MM-DD
      if (this.roomData.booking_Date && typeof this.roomData.booking_Date === 'object') {
        this.roomData.booking_Date = this.formatDate(this.roomData.booking_Date);
      }
      if (this.roomData.cancel_Date && typeof this.roomData.cancel_Date === 'object') {
        this.roomData.cancel_Date = this.formatDate(this.roomData.cancel_Date);
      }

      this.formData.append('form', JSON.stringify(this.roomData));
      this.formData.append('room', JSON.stringify(data));


      this.allServe.submitRoomsBook( this.formData).subscribe(
        (data) => {
          // Handle successful submission
          this.getRm();
          this.getRmBook();
          this.clearForm();

          // @ts-ignore
          this.removeRoom();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }


  }

  getPackage(){
    this.hotelServes.getPackage().subscribe(
      (response: any) => {
        this.packages = response;
      },
      (error) => {
        console.error('Error fetching rooms Book:', error);
      }
    );
  }

  handleError(error: { error: null; }){
   return  this.error=error.error;
  }

  formatDate(obj:any){
    const month = String(obj['month']).padStart(2, '0');
    const day = String(obj['day']).padStart(2, '0');
    return `${obj['year']}-${month}-${day}`;
}

  getGuest() {
    this.allServe.getGuests().subscribe(
      (response: any) => {
        this.guests = response.data;
      },
      (error) => {
        this.handleError(error);
        console.error('Error fetching guest:', error);
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
  getRmCat() {
    this.allServe.getRoomsCategory().subscribe(
      (response: any) => {
          this.roomCategories = response.data;
      },
      (error) => {
        console.error('Error fetching rooms Categories:', error);
      }
    );
  }

  addSelectedRoom() {
    const selectedRoomCategoryId = this.rmBookForm.get('room_category_id')?.value;
    const numberOfRooms = Number(this.rmBookForm.get('no_of_rooms')?.value);

    if (!selectedRoomCategoryId) {
      alert('Please select a room category.');
      return;
    }

    if (numberOfRooms <= 0 || isNaN(numberOfRooms)) {
      alert('Please enter a valid room count.');
      return;
    }

    const room = this.roomCategories.find(
      (r: any) => String(r.id) === String(selectedRoomCategoryId)
    );

    if (!room) {
      alert('Selected room category not found.');
      return;
    }

    this.allServe.getRoomCategoryById(selectedRoomCategoryId).subscribe({
      next: (roomCat: any) => {

        const existing = this.booksRooms.find(
          (r: any) => String(r.room_category_id) === String(selectedRoomCategoryId)
        );

        if (existing) {
          // Increase room count if already added
          existing.no_of_rooms += numberOfRooms;
        } else {
          this.booksRooms.push({
            ...room,
            room_category_id: selectedRoomCategoryId,
            name: roomCat.name,
            no_of_rooms: numberOfRooms
          });
        }

        this.rmBookForm.patchValue({
          room_category_id: '',
          no_of_rooms: ''
        });
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load room category details.');
      }
    });
  }

  removeRoom(index: number) {
       this.booksRooms.splice(index, 1);
  }

  deleteRmBook(id:any) {
    this.allServe.deleteRoomBook(id).subscribe(
      (data: any) => {
        this.getRmBook();
        this.getRm();
      },
      (error) => {
        console.error('Error fetching room Book:', error);
      }
    );
  }

  getRmBook() {
    this.allServe.getRoomBook().subscribe(
      (response: any) => {
        this.roomsBooks = response.data;
      },
      (error) => {
        console.error('Error fetching rooms Book:', error);
      }
    );
  }

  search() {
    let val = this.rmBookSearchDateField.value;
    let s_r_id = this.rmBookSearchRIdField.value;

    if (val && s_r_id) {
      let date =this.formatDate(val);
      // Both date and room ID are provided, use the combined search
      this.searchServe.getRoomBookByDateAndRoom(s_r_id, date).subscribe(
        (data: any) => {
          this.roomsBooks = data;
        },
        (error) => {
          console.error('Error fetching rooms Book:', error);
        }
      );
    } else if (val) {
      let date =this.formatDate(val);
      // Only date is provided, use the date-based search
      this.searchServe.getRoomBookByDate(date).subscribe(
        (data: any) => {
          this.roomsBooks = data;
        },
        (error) => {
          console.error('Error fetching rooms Book:', error);
        }
      );
    } else if (s_r_id) {
      // Only room ID is provided, use the room-based search
      this.searchServe.getRoomBookByRoom(s_r_id).subscribe(
        (data: any) => {
          this.roomsBooks = data;
        },
        (error) => {
          console.error('Error fetching rooms Book:', error);
        }
      );
    } else {
      // Neither date nor room ID is provided, clear the results
      console.error('Select search Option');
      this.roomsBooks = [];
    }
  }

  clearSearchForm() {
    this.rmBookSearchDateField.setValue("");
    this.rmBookSearchRIdField.setValue("Select Room No");
    this.getRmBook();
  }

  getRmBookById(id:any) {
    this.allServe.getRoomBookById(id).subscribe(
      (response: any) => {
       this.rmBookForm.patchValue(response);

      },
      (error) => {
        console.error('Error fetching rooms Book:', error);
      }
    );
  }

  updateRmBook() {
    if (this.rmBookForm.valid) {
      this.roomData = this.rmBookForm.getRawValue();

      // Format dates from NgbDatepicker format to YYYY-MM-DD
      if (this.roomData.booking_Date && typeof this.roomData.booking_Date === 'object') {
        this.roomData.booking_Date = this.formatDate(this.roomData.booking_Date);
      }
      if (this.roomData.cancel_Date && typeof this.roomData.cancel_Date === 'object') {
        this.roomData.cancel_Date = this.formatDate(this.roomData.cancel_Date);
      }

      this.allServe.updateRoomBook(this.roomData, this.roomData.id).subscribe(
        (data) => {
          // Handle successful submission
          this.getRm();
          this.getRmBook();
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }

  ngOnInit() {
    this.getRmBook();
    this.getRm();
    this.getGuest();
    this.getPackage();
    this.getRmCat();

  }

  objectValues(obj: any): any[] {
    return Object.values(obj);
  }



}
