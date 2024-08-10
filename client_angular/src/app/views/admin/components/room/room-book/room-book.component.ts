import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective, FormSelectDirective,
  RowComponent, TableDirective, TemplateIdDirective,
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {RoomBook} from "../../../../../entities/roomBook";
import { NgForOf, NgIf} from "@angular/common";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";



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
  ],
  templateUrl: './room-book.component.html',
  styleUrl: './room-book.component.scss'
})
export class RoomBookComponent {


  guests: any[] = [];
  rooms: any[] = [];
  roomsBooks: any[] = [];

  formData = new FormData();
  rmBookForm: FormGroup;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {

    this.rmBookForm = this.fb.group({

      r_id: ['', [Validators.required]],
      guest_id: ['', [Validators.required]],
      r_book: ['', [Validators.required]],
      booking_Date: ['', [Validators.required]],
      cancel_Date: [''],
    });

  }

  get rmBookRIdField(): FormControl {
    return this.rmBookForm.controls['r_id'] as FormControl;
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
  clearForm() {
    this.rmBookField.setValue("");
    this.rmBookRIdField.setValue("Select Room No");
    this.rmBookGIdField.setValue("Select Guest");
    this.rmBookCancelDateField.setValue("");
    this.rmBookDateField.setValue("");

  }
  async onSubmit() {
    this.formData = new FormData();
    if (this.rmBookForm.valid) {

      let rmBook = new RoomBook();

      rmBook.r_book= this.rmBookField.value;
      rmBook.r_id= this.rmBookRIdField.value;
      rmBook.guest_id= this.rmBookGIdField.value;
      rmBook.cancel_Date = this.rmBookCancelDateField.value;
      rmBook.booking_Date = this.rmBookDateField.value;

      console.log(rmBook)

      this.formData.append('form', JSON.stringify(rmBook));
      await this.allServe.submitRoomsBook(this.formData);
      this.getRmBook();
      this.clearForm();
      this.toastr.success("Rooms Category Successfully submit ");
    }
  }


  getGuest() {
    this.allServe.getGuests().subscribe(
      (response: any) => {
        this.guests = response.data;
      },
      (error) => {
        console.error('Error fetching guest:', error);
      }
    );
  }
  getRm() {
    this.allServe.getRoom().subscribe(
      (data: any) => {
        this.rooms = data;
      },
      (error) => {
        console.error('Error fetching rooms:', error);
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

  ngOnInit() {
    this.getRmBook();
    this.getRm();
    this.getGuest();
  }

  objectValues(obj: any): any[] {
    return Object.values(obj);
  }
}
