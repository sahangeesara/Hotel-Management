import { Component } from '@angular/core';
import {
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective, FormTextDirective, RowComponent
} from "@coreui/angular";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {Guide} from "../../../../../entities/guide";
import {Guest} from "../../../../../entities/guest";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-guest-add',
  standalone: true,
    imports: [
        ButtonDirective,
        ColComponent,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        NgForOf,
        ReactiveFormsModule,
        RowComponent
    ],
  templateUrl: './guest-add.component.html',
  styleUrl: './guest-add.component.scss'
})
export class GuestAddComponent {
  public error=null;

  guest:any;
  guestGenders: any[] = [];
  guides: any[] = [];
  formData = new FormData();
  guestForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.guestForm = this.fb.group({

      name: ['', [Validators.required]],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
      guide_id: [''],
      guest_type: ['', Validators.required],
      country: ['', Validators.required],
    });

  }

  get guestGenField(): FormControl {
    return this.guestForm.controls['gender_id'] as FormControl;
  }
  get guideField(): FormControl {
    return this.guestForm.controls['guide_id'] as FormControl;
  }

  clearForm() {

    this.guestForm.reset();
    this.guestGenField.setValue("Select Guest Gender");
    this.guideField.setValue("Select Guide");


  }

   onSubmit() {

    if (this.guestForm.valid) {

     this.guest = this.guestForm.getRawValue();

      this.allServe.submitGuest(this.guest).subscribe(
        (response) => {
          // Handle successful submission
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

  getGuestGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.guestGenders = response.data;
      },
      (error) => {
        console.error('Error fetching Guest Gender:', error);
      }
    );
  }
  getGuide() {
    this.allServe.getGuideByAssign().subscribe(
      (data: any) => {
        this.guides = data;
      },
      (error) => {
        console.error('Error fetching guide:', error);
      }
    );
  }


  ngOnInit() {
    this.getGuestGen();
    this.getGuide();
  }
}
