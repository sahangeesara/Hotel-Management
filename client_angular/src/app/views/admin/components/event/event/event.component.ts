import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import { NgForOf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {EventService} from "../../../../../services/event.service";


@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    IconDirective,
    NgForOf,
    ReactiveFormsModule,
    TableDirective
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {

  public error=null;
  events: any[] = [];
  formData = new FormData();
  eventForm: FormGroup;
  eventData:any;
  public isEditMode = false;
  constructor(   private eventServe: EventService,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.eventForm = this.fb.group({

      id: [''],
      event_no: [''],
      name: ['', [Validators.required]]
    });

  }


  clearForm() {
    this.eventForm.reset();
    this.isEditMode = false;
  }

  getEventById(id:any){
    this.eventServe.getEventById(id).subscribe(
      (event:any) => {
        this.eventForm.patchValue({
          id: event.id,
          event_no: event.event_no,
          name: event.name
        });
        this.isEditMode = true; // Enable update button
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  updateEvent() {
    if (this.eventForm.valid) {
      this.eventData = this.eventForm.getRawValue();

      this.eventServe.updateEvent(this.eventData, this.eventData.id).subscribe(
        (response) => {
          // Handle successful response
          this.getEvent();
          this.clearForm();
        },
        (error) => {
          // Handle error response
          this.handleError(error);
        }
      );
    }
  }

  getEvent() {
    this.eventServe.getEvent().subscribe(
      (response: any) => {
        this.events = response;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  onSubmit() {
    if (this.eventForm.valid) {

      this.eventData = this.eventForm.getRawValue();

      this.eventServe.submitEvents(this.eventData).subscribe(
        (response) => {
          // Handle successful submission
          this.getEvent();
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

  deleteEvent(id:any){
    this.eventServe.deleteEvent(id).subscribe(
      (data: any) => {
        this.getEvent();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

   ngOnInit() {
    this.getEvent();
  }
}
