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
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Guide} from "../../../../../entities/guide";

@Component({
  selector: 'app-guide-update',
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
  templateUrl: './guide-update.component.html',
  styleUrl: './guide-update.component.scss'
})
export class GuideUpdateComponent {
  guid:any;
  public error=null;

  guideGenders: any[] = [];
  formData = new FormData();
  guideUpdateForm: FormGroup;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.guideUpdateForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
    });

  }
  get guideGenField(): FormControl {
    return this.guideUpdateForm.controls['gender_id'] as FormControl;
  }

  getData(data:any){
      this.guideUpdateForm.patchValue(data);
  }
  geGuideGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {  this.guideGenders = response.data;  },
      (error) => {   console.error('Error fetching employee Gender:', error);  }
    );
  }

  ngOnInit() { this.geGuideGen(); }

  guideUpdate() {
    this.formData = new FormData();
    if (this.guideUpdateForm.valid) {

    this.guid =this.guideUpdateForm.getRawValue();

      this.formData.append('form', JSON.stringify( this.guid));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateGuide(this.formData, this.guid.id));

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
  handleError(error: { error: null; }){  return  this.error=error.error; }
  clearForm() {
    this.guideUpdateForm.reset();
    this.guideGenField.setValue("Select guide Gender");
  }
}
