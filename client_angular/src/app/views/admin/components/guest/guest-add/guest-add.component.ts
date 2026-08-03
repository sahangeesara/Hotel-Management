import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {CuntryService} from "../../../../../services/cuntry.service";

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
    RowComponent,
    TableDirective,
    NgIf
  ],
  templateUrl: './guest-add.component.html',
  styleUrl: './guest-add.component.scss'
})
export class GuestAddComponent implements OnInit {
  public error=null;

  guest:any;
  guestData:any;
  guestGenders: any[] = [];
  guestDetails: any[] = [];
  guides: any[] = [];
  countryCodes: any[] = [];
  countries: any[] = [];
  formData = new FormData();
  guestForm: FormGroup;
  foreignGuestId:any;
  foreignGuestDependId:any;
  isForeign=false;
  isLocal=false;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private countryService: CuntryService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.guestForm = this.fb.group({

      name: ['', [Validators.required]],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.maxLength(12) ]],
      city: ['', [Validators.required]],
      tel_no: ['', [Validators.required, Validators.maxLength(10)]],
      gender_id: ['', Validators.required],
      foreign_nic: [''],
      country_id: ['', Validators.required],
      cuntry_code_id: ['', Validators.required],
      guide_id: [''],
      guest_type: ['', Validators.required],
      adults: ['', Validators.required],
      children: [''],
      infants: [''],
      dependent_name: [''],
      dependent_relationship: [''],
      dependent_id: [''],
      age: [''],
      });

  }


  clearForm() {

    this.guestForm.reset();
    this.guestForm.patchValue({
      gender_id: '',
      country_id: '',
      guide_id: '',
      country_code_id: '',
    });
  }

  generateGuestId() {
    const name = this.guestForm.get('name')?.value || '';
    const telNo = this.guestForm.get('tel_no')?.value || '';

    const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();

    const telSuffix = String(telNo).slice(-3);

    this.foreignGuestId = namePrefix +"-" + telSuffix;
    this.guestForm.patchValue({
      foreign_nic: this.foreignGuestId
    });
  }

  generateGuestDependId(){
    const foreignNic = this.foreignGuestId;
    const relationship = this.guestForm.get('dependent_relationship')?.value;
    const age = this.guestForm.get('age')?.value;
    this.foreignGuestDependId = relationship +"-" + foreignNic +"-" + age ;
  }
  selectGuestType() {
    const nameControl = this.guestForm.get('name');
    const telControl = this.guestForm.get('tel_no');

    if (!nameControl?.value || !telControl?.value) {
      alert("Name and Telephone number are required!");
    }

    const type = this.guestForm.get('guest_type')?.value;

    if (type === "Foreign") {
      this.isForeign = true;
      this.isLocal =false;
      this.guestForm.get('nic')?.disable();
      this.guestForm.get('foreign_nic')?.enable();

      this.generateGuestId();
      this.guestForm.patchValue({
        foreign_nic: this.foreignGuestId
      })
    }else if (type === "Local") {
      const nic = this.guestForm.get('nic')?.value || '';

      this.isForeign = false;
      this.isLocal = true;
      this.guestForm.get('foreign_nic')?.disable();
      this.guestForm.get('nic')?.enable();

      if (nic) {
        this.checkNicAndSetGender(nic);
      }

    }else {
      this.isForeign = false;
      this.isLocal = false;
      this.guestForm.get('foreign_nic')?.disable();
      this.guestForm.get('nic')?.disable();
    }
  }


  addSelectedGuest() {
    const dependentName = this.guestForm.get('dependent_name')?.value;
    const relationship = this.guestForm.get('dependent_relationship')?.value;
    const age = this.guestForm.get('age')?.value;

    this.generateGuestDependId();

      this.guestDetails.push({
        dependent_id: this.foreignGuestDependId,
        dependent_name: dependentName,
        dependent_relationship: relationship,
        age: age,
      });

    this.guestForm.patchValue({ dependent_name: '', dependent_relationship: '', age : '' });

  }
  removeGuest(index: number) {
    this.guestDetails.splice(index, 1);
  }

   onSubmit() {

    if (this.guestForm.valid) {

     this.guestData = this.guestForm.getRawValue();
      let data = this.guestDetails;


      this.formData.append('form', JSON.stringify(this.guestData));
      this.formData.append('guestDetails', JSON.stringify(data));
      this.allServe.submitGuest(this.formData).subscribe(
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
  setCountryCode(event: Event) {
    const countryId = Number((event.target as HTMLSelectElement).value);

    const countryCode = this.countryCodes.find(
      x => x.cuntry_id === countryId
    );

    if (countryCode) {
      this.guestForm.patchValue({
        cuntry_code_id: countryCode.id
      });
    }
  }
  getCountryCode() {
    this.countryService.getCuntryCode().subscribe(
      (response: any) => {
        this.countryCodes = response.data;
      },
      (error) => {
        console.error('Error fetching Guest Gender:', error);
      }
    );
  }
  getCountries() {
    this.countryService.getNationality().subscribe(
      (response: any) => {
        this.countries = response.data;
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
  checkNicAndSetGender(nic: string) {
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.guestForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false }); // { emitEvent: false } prevents infinite loops
      }
    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.guestForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }
    }
  }


  ngOnInit() {
    this.getGuestGen();
    this.getGuide();
    this.getCountryCode();
    this.getCountries();
    this.guestForm.get('nic')?.valueChanges.subscribe(nicValue => {
      if (this.isLocal && nicValue) {
        this.checkNicAndSetGender(nicValue);
      }
    });
  }
}
