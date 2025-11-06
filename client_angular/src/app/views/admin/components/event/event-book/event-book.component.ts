import { Component } from '@angular/core';
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
        TableDirective
    ],
  templateUrl: './event-book.component.html',
  styleUrl: './event-book.component.scss'
})
export class EventBookComponent {
  guests: any[] = [];
  eventBook:FormGroup;
  searchEventBookForm:FormGroup;
  eventBookData:any;
  public error=null;
  rooms: any[] = [];
  roomsBooks: any[] = [];
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {

    this.eventBook = this.fb.group({

      id: [''],
      r_id: ['', [Validators.required]],
      booking_no: [''],
      guest_id: ['', [Validators.required]],
      r_book: ['', [Validators.required]],
      booking_Date: ['', [Validators.required]],
      cancel_Date: ['',[Validators.required]],
    });

    this.searchEventBookForm  = this.fb.group({
      search_booking_Date: [''],
      search_r_id: [''],

    });
  }

  onSubmit() {
    if (this.eventBook.valid) {
      // const rmBook = {
      //   r_book: this.rmBookField.value,
      //   r_id: this.rmBookRIdField.value,
      //   guest_id: this.rmBookGIdField.value,
      //   cancel_Date: this.formatDate(this.rmBookCancelDateField.value),
      //   booking_Date: this.formatDate(this.rmBookDateField.value)
      // };
      this.eventBookData = this.eventBook.getRawValue();
      this.allServe.submitRoomsBook(this.eventBookData).subscribe(
        (data) => {

          // // Handle successful submission
          // this.getRm();
          // this.getRmBook();
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }
  clearSearchForm() {
    // this.rmBookSearchDateField.setValue("");
    // this.rmBookSearchRIdField.setValue("Select Room No");
    // this.getRmBook();
  }
  clearForm() {
    this.eventBook.reset();
    // this.empTypeField.patchValue("Select Employee Type");
    // this.empGenField.patchValue("Select Employee Gender");

  }
  search() {

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
  updateRmBook(){

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

  deleteRmBook(id:any) {
    // this.allServe.deleteRoomBook(id).subscribe(
    //   (data: any) => {
    //     this.getRmBook();
    //     this.getRm();
    //   },
    //   (error) => {
    //     console.error('Error fetching room Book:', error);
    //   }
    // );
  }
  getRmBookById(id:any) {
    // this.allServe.getRoomBookById(id).subscribe(
    //   (response: any) => {
    //     this.rmBookForm.patchValue(response);
    //
    //     // this.roomsBooks = response.data;
    //   },
    //   (error) => {
    //     console.error('Error fetching rooms Book:', error);
    //   }
    // );
  }
  ngOnInit() {
    this.getRmBook();
    this.getRm();
    this.getGuest();
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
  objectValues(obj: any): any[] {
    return Object.values(obj);
  }
}
