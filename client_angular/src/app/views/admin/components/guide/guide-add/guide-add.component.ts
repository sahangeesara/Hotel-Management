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
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required,Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
    });

  }
  get guideNameField(): FormControl {
    return this.guideForm.controls['name'] as FormControl;
  }
  get guideAddressField(): FormControl {
    return this.guideForm.controls['address'] as FormControl;
  }
  get guideEmailField(): FormControl {
    return this.guideForm.controls['email'] as FormControl;
  }
  get guideCityField(): FormControl {
    return this.guideForm.controls['city'] as FormControl;
  }
  get guideNicField(): FormControl {
    return this.guideForm.controls['nic'] as FormControl;
  }
  get guideTelNoField(): FormControl {
    return this.guideForm.controls['tel_no'] as FormControl;
  }
  get guideGenField(): FormControl {
    return this.guideForm.controls['gender_id'] as FormControl;
  }

  clearForm() {
    this.guideNameField.setValue("");
    this.guideAddressField.setValue("");
    this.guideNicField.setValue("");
    this.guideCityField.setValue("");
    this.guideTelNoField.setValue("");
    this.guideGenField.setValue("Select Guide Gender");
    this.guideEmailField.setValue("");

  }

  onSubmit() {
    this.formData = new FormData();
    if (this.guideForm.valid) {

      let guid = new Guide();

      guid.name= this.guideNameField.value;
      guid.address= this.guideAddressField.value;
      guid.nic= this.guideNicField.value;
      guid.city= this.guideCityField.value;
      guid.tel_no= this.guideTelNoField.value;
      guid.gender_id= this.guideGenField.value;
      guid.email= this.guideEmailField.value;


      this.formData.append('form', JSON.stringify(guid));
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
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }

  getGuideGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.guideGenders = response.data;
      },
      (error) => {
        console.error('Error fetching guide Gender:', error);
      }
    );
  }


  ngOnInit() {
    this.getGuideGen();
  }

}
