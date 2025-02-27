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
import {Employee} from "../../../../../entities/employee";
import {Guide} from "../../../../../entities/guide";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-guide-add',
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
  templateUrl: './guide-add.component.html',
  styleUrl: './guide-add.component.scss'
})
export class GuideAddComponent {
  guid:any;
  public error=null;
  guideGenders: any[] = [];
  formData = new FormData();
  guideForm: FormGroup;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.guideForm = this.fb.group({

      name: ['', [Validators.required]],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
    });

  }

  get guideGenField(): FormControl { return this.guideForm.controls['gender_id'] as FormControl; }

  clearForm() {
    this.guideForm.reset();
    this.guideGenField.setValue("Select Guide Gender");
    }

  onSubmit() {
    this.formData = new FormData();
    if (this.guideForm.valid) {

      this.guid = this.guideForm.getRawValue();

      this.formData.append('form', JSON.stringify(this.guid));
      const submissionObservable = from( this.allServe.submitGuide(this.formData));

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
  handleError(error: { error: null; }){ return  this.error=error.error;}

  getGuideGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => { this.guideGenders = response.data; },
      (error) => { console.error('Error fetching guide Gender:', error); });
  }

  ngOnInit() {
    this.getGuideGen();
  }

}
