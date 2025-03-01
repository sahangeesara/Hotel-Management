import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective, FormSelectDirective, FormTextDirective,
  RowComponent, TableDirective, TemplateIdDirective,
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {RoomBook} from "../../../../../entities/roomBook";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {IconDirective} from "@coreui/icons-angular";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {SearchService} from "../../../../../services/search.service";



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
    TemplateIdDirective,
    NgbInputDatepicker,
    IconDirective,
    DatePipe,
    FormTextDirective,
  ],
  templateUrl: './room-book.component.html',
  styleUrl: './room-book.component.scss'
})
export class RoomBookComponent {

  guests: any[] = [];
  rooms: any[] = [];
  roomsBooks: any[] = [];
  public error=null;
  formData = new FormData();
  rmBookForm: FormGroup;
  rmSearchBookForm: FormGroup;
  rmBook:any;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {

    this.rmBookForm = this.fb.group({

      id: [''],
      r_id: ['', [Validators.required]],
      booking_no: [''],
      guest_id: ['', [Validators.required]],
      r_book: ['', [Validators.required]],
      booking_Date: ['', [Validators.required]],
      cancel_Date: ['',[Validators.required]],
    });

    this.rmSearchBookForm  = this.fb.group({
      search_booking_Date: [''],
      search_r_id: [''],

    });
  }
//add or update form
  get rmBookRIdField(): FormControl {
    return this.rmBookForm.controls['r_id'] as FormControl;
  }
  get rmBookIdField(): FormControl {
    return this.rmBookForm.controls['id'] as FormControl;
  }
  get rmBookGIdField(): FormControl {
    return this.rmBookForm.controls['guest_id'] as FormControl;
  }
  get rmBookField(): FormControl {
    return this.rmBookForm.controls['r_book'] as FormControl;
  }
  get rmBookDateField(): FormControl {
    return this.rmBookForm.controls['booking_Date'] as FormControl;
  }
   get rmBookCancelDateField(): FormControl {
    return this.rmBookForm.controls['cancel_Date'] as FormControl;
  }
   get rmBookNumberField(): FormControl {
    return this.rmBookForm.controls['booking_no'] as FormControl;
  }


  //search form
  get rmBookSearchDateField(): FormControl {
    return this.rmSearchBookForm.controls['search_booking_Date'] as FormControl;
  }
  get rmBookSearchRIdField(): FormControl {
    return this.rmSearchBookForm.controls['search_r_id'] as FormControl;
  }

  clearForm() {
   this.rmBookForm.reset()

  }
   onSubmit() {
    this.formData = new FormData();
    if (this.rmBookForm.valid) {

      let rmBook = new RoomBook();

      rmBook.r_book= this.rmBookField.value;
      rmBook.r_id= this.rmBookRIdField.value;
      rmBook.guest_id= this.rmBookGIdField.value;
      rmBook.cancel_Date = this.formatDate(this.rmBookCancelDateField.value);
      rmBook.booking_Date = this.formatDate(this.rmBookDateField.value);

      this.formData.append('form', JSON.stringify(rmBook));
      const submissionObservable =  from(this.allServe.submitRoomsBook(this.formData));

      // Use pipe() to apply operators
      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRm();
            this.getRmBook();
            this.clearForm();
            return data; // If you need to return a value for further processing
          }),
          catchError((error) => {
            // Handle errors here
            this.handleError(error);
            return throwError(() => new Error(error?.error || "Server Error"));          })
        )
        .subscribe();
    }
  }
  handleError(error: { error: null; }){
   return  this.error=error.error;
  }
formatDate(obj:any){
    return obj['year']+'-'+obj['month']+'-'+obj['day']
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

        // this.roomsBooks = response.data;
      },
      (error) => {
        console.error('Error fetching rooms Book:', error);
      }
    );
  }

  updateRmBook(){

    this.formData = new FormData();
    if (this.rmBookForm.valid) {

      let id =this.rmBookIdField.value;

      let rmBook = new RoomBook();

      rmBook.id= this.rmBookIdField.value;
      rmBook.r_book= this.rmBookField.value;
      rmBook.r_id= this.rmBookRIdField.value;
      rmBook.guest_id= this.rmBookGIdField.value;
      rmBook.booking_no= this.rmBookNumberField.value;
      rmBook.cancel_Date = this.formatDate(this.rmBookCancelDateField.value);
      rmBook.booking_Date = this.formatDate(this.rmBookDateField.value);

      this.formData.append('form', JSON.stringify(rmBook));
      this.formData.append('_method', 'patch');
      const submissionObservable =  from(this.allServe.updateRoomBook(this.formData,id));

      // Use pipe() to apply operators
      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRm();
            this.getRmBook();
            this.clearForm();
            return data; // If you need to return a value for further processing
          }),
          catchError((error) => {
            // Handle errors here
            this.handleError(error);
            return throwError(error); // Re-throw the error if you want to propagate it further
          })
        )
        .subscribe();
    }

  }

  ngOnInit() {
    this.getRmBook();
    this.getRm();
    this.getGuest();
  }

  objectValues(obj: any): any[] {
    return Object.values(obj);
  }



}
