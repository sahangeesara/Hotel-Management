import { Component } from '@angular/core';
import {
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent
} from "@coreui/angular";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-customer-update',
  standalone: true,
  imports: [
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.scss'
})
export class CustomerUpdateComponent {
  customGenders: any[] = [];
  imageUrl?: string = 'assets/default.png';
  formData = new FormData();
  customerUpdateForm:any;
  file:any;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ){
    this.customerUpdateForm = this.fb.group({

      id: [''],
      user_id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      tellNo: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      image: ['', [Validators.required]],
      nic: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      image_url: ['' ],
    });
  }
  get userIdField(): FormControl {
    return this.customerUpdateForm.controls['user_id'] as FormControl;
  }
  get userNameField(): FormControl {
    return this.customerUpdateForm.controls['name'] as FormControl;
  }
  get userEmailField(): FormControl {
    return this.customerUpdateForm.controls['email'] as FormControl;
  }
  get customerAddressField(): FormControl {
    return this.customerUpdateForm.controls['address'] as FormControl;
  }
  get customerIdField(): FormControl {
    return this.customerUpdateForm.controls['id'] as FormControl;
  }
  get customerCountryField(): FormControl {
    return this.customerUpdateForm.controls['country'] as FormControl;
  }
  get customerGenField(): FormControl {
    return this.customerUpdateForm.controls['gender_id'] as FormControl;
  }
  get customerTelNoField(): FormControl {
    return this.customerUpdateForm.controls['tellNo'] as FormControl;
  }
  get customerCityField(): FormControl {
    return this.customerUpdateForm.controls['city'] as FormControl;
  }
  get customerNicField(): FormControl {
    return this.customerUpdateForm.controls['nic'] as FormControl;
  }
  get customerImageField(): FormControl {
    return this.customerUpdateForm.controls['image'] as FormControl;
  }
  getData(data: any) {
    this.userIdField.setValue(data.user_id);
    this.userNameField.setValue(data.user.name);
    this.userEmailField.setValue(data.user.email);
    this.customerAddressField.setValue(data.address);
    this.imageUrl= data.image_url;
    this.customerCountryField.setValue(data.country);
    this.customerGenField.setValue(data.gender_id);
    this.customerTelNoField.setValue(data.tel_no);
    this.customerCityField.setValue(data.city);
    this.customerNicField.setValue(data.nic);
    this.customerIdField.setValue(data.id);
  }

  selectImage(e:any):void{
    this.file = e.target.files ? e.target.files[0] : '';

    if (this.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        // console.log(this.imageUrl)
      };
    }

  }
  customUpdate(){

  }
  getCustomGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.customGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }
  ngOnInit() {this.getCustomGen();    }

}
