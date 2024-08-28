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
  get guideIdField(): FormControl {
    return this.guideUpdateForm.controls['name'] as FormControl;
  }
  get guideNameField(): FormControl {
    return this.guideUpdateForm.controls['name'] as FormControl;
  }
  get guideAddressField(): FormControl {
    return this.guideUpdateForm.controls['address'] as FormControl;
  }
  get guideEmailField(): FormControl {
    return this.guideUpdateForm.controls['email'] as FormControl;
  }
  get guideCityField(): FormControl {
    return this.guideUpdateForm.controls['city'] as FormControl;
  }
  get guideNicField(): FormControl {
    return this.guideUpdateForm.controls['nic'] as FormControl;
  }
  get guideTelNoField(): FormControl {
    return this.guideUpdateForm.controls['tel_no'] as FormControl;
  }
  get guideGenField(): FormControl {
    return this.guideUpdateForm.controls['gender_id'] as FormControl;
  }

  getData(data:any){
    this.guideIdField.setValue(data.name);
    this.guideNameField.setValue(data.name);
    this.guideAddressField.setValue(data.address);
    this.guideEmailField.setValue(data.email);
    this.guideCityField.setValue(data.city);
    this.guideNicField.setValue(data.nic);
    this.guideTelNoField.setValue(data.tel_no);
    this.guideGenField.setValue(data.gender_id);

  }
  geGuideGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.guideGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }

  ngOnInit() {
    this.geGuideGen();
  }

  guideUpdate() {
    this.formData = new FormData();
    if (this.guideUpdateForm.valid) {

      let id = this.guideIdField.value;
      let guide = new Guide();

      guide.name= this.guideNameField.value;
      guide.address= this.guideAddressField.value;
      guide.nic= this.guideNicField.value;
      guide.city= this.guideCityField.value;
      guide.tel_no= this.guideTelNoField.value;
      guide.gender_id= this.guideGenField.value;
      guide.email= this.guideEmailField.value;

      this.formData.append('form', JSON.stringify(guide));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateGuide(this.formData,id));

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
    this.guideIdField.setValue("");
    this.guideNameField.setValue("");
    this.guideAddressField.setValue("");
    this.guideNicField.setValue("");
    this.guideCityField.setValue("");
    this.guideTelNoField.setValue("");
    this.guideGenField.setValue("Select guide Gender");
    this.guideEmailField.setValue("");
  }
}
