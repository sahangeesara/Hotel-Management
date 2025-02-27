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
import {Guest} from "../../../../../entities/guest";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-guest-update',
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
  templateUrl: './guest-update.component.html',
  styleUrl: './guest-update.component.scss'
})
export class GuestUpdateComponent {

  guest:any;
  public error=null;
  guestGenders: any[] = [];
  guides: any[] = [];
  formData = new FormData();
  guestUpadeForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.guestUpadeForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
      guide_id: [''],
      guest_type: ['', Validators.required],
      guide_status: [''],
      country: ['', Validators.required],
    });

  }

  get guestGenField(): FormControl {
    return this.guestUpadeForm.controls['gender_id'] as FormControl;
  }
  get guideField(): FormControl {
    return this.guestUpadeForm.controls['guide_id'] as FormControl;
  }
  get guideStatusField(): FormControl {
    return this.guestUpadeForm.controls['guide_status'] as FormControl;
  }

  getData(data:any){
    this.guestUpadeForm.patchValue(data);

    if (data.guide) {
      this.guideStatusField.setValue(data.guide.guide_status);
    } else {
      // Set guideStatusField to a default value (optional)
      this.guideStatusField.setValue('');
    }
  }



  geGuestGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.guestGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }
  getGuide() {
    this.allServe.getGuide().subscribe(
      (response: any) => {
        this.guides = response.data;
      },
      (error) => {
        console.error('Error fetching guide:', error);
      }
    );
  }


  ngOnInit() {
    this.geGuestGen();
    this.getGuide();

  }


  guestUpdate() {
    this.formData = new FormData();
    if (this.guestUpadeForm.valid) {

      this.guest = this.guestUpadeForm.getRawValue();

      this.formData.append('form', JSON.stringify(this.guest));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateGuests(this.formData,this.guest.id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
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
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }

  clearForm() {
    this.guestUpadeForm.reset();
    this.guestGenField.setValue("Select Guest Gender");
    this.guideField.setValue("Select Guide");
    this.guideStatusField.setValue("Select Guide Status");

  }
}
