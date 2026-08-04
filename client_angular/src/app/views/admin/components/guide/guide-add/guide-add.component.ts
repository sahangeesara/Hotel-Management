import {Component, OnInit} from '@angular/core';
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
export class GuideAddComponent implements OnInit {
  guid:any;
  public error=null;
  guideGenders: any[] = [];
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

  clearForm() {
    this.guideForm.reset();
    this.guideForm.patchValue({ gender_id: '' });
    if(this.guideForm.disabled){
      this.guideForm.enable();
    }
    }

  onSubmit() {
    if (this.guideForm.valid) {

      this.guid = this.guideForm.getRawValue();

      this.allServe.submitGuide(this.guid).subscribe(
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
  handleError(error: { error: null; }){ return  this.error=error.error;}

  getGuideGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => { this.guideGenders = response.data; },
      (error) => { console.error('Error fetching guide Gender:', error); });
  }
  checkNicAndSetGender(nic: string) {
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.guideForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false }); // { emitEvent: false } prevents infinite loops
      }
      const val= parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear =Number("19"+val);

      const age = currentYear - birthYear;

      if (age < 18) {
        this.guideForm.disable();
      }

    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.guideForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val= parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear =Number(val);

      const age = currentYear - birthYear;

      if (age < 18) {
        this.guideForm.disable();
      }
    }
  }

  ngOnInit() {
    this.getGuideGen();
    this.guideForm.get('nic')?.valueChanges.subscribe(nicValue => {
        this.checkNicAndSetGender(nicValue);
    });
  }

}
