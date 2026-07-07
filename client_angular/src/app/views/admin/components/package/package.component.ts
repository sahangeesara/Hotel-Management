import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective, FormSelectDirective, FormTextDirective,
  RowComponent, TableDirective, TemplateIdDirective,
} from "@coreui/angular";

import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {IconDirective} from "@coreui/icons-angular";
import {AllServiceService} from "../../../../services/all-service.service";
import {HotelService} from "../../../../services/hotel.service";
import {SearchService} from "../../../../services/search.service";
import {NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-package',
  standalone: true,
  imports: [
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormsModule,
    IconDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    FormTextDirective
  ],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit{
  packageForm: FormGroup;
  formData = new FormData();
  public error=null;
  packages: any[] = [];
  packageTypes: any[] = [];
  public isEditMode = false;

  packageData:any;
  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private  hotelServes:HotelService,
                 private searchServe: SearchService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ) {

    this.packageForm = this.fb.group({

      id: [''],
      description: ['', [Validators.required]],
      name: [''],
      package_type_id: ['', [Validators.required]],
      package_amount: ['', [Validators.required]],
      package_no: [{value: '', disabled: true }],
    });

  }

  getPackage(){
    this.hotelServes.getPackage().subscribe(
      (response: any) => {
        this.packages = response;
      },
      (error) => {
        console.error('Error fetching rooms Book:', error);
      }
    );
  }
  getPackageType(){
    this.hotelServes.getPackageType().subscribe(
      (response: any) => {
        this.packageTypes = response.data;
      },
      (error) => {
        console.error('Error fetching Package Type:', error);
      }
    );
  }

  onSubmit() {
    if (this.packageForm.valid) {
      this.packageData = this.packageForm.getRawValue();

      this.hotelServes.submitPackage(this.packageData).subscribe(
        (data) => {
          // Handle successful submission
          this.getPackage();
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
  clearForm() {
    this.packageForm.reset();
  }
  ngOnInit() {
    this.getPackage();
    this.getPackageType();
  }

  updatePackage() {
    if (this.packageForm.valid) {
      this.packageData = this.packageForm.getRawValue();

      this.hotelServes.updateHotel(this.packageData, this.packageData.id).subscribe(
        (response) => {
          // Handle successful response
          this.getPackage();
          this.clearForm();
        },
        (error) => {
          // Handle error response
          this.handleError(error);
        }
      );
    }
  }

  getPackageById(id:any) {
    this.hotelServes.getPackageById(id).subscribe(
      (Package:any) => {
        this.packageForm.patchValue({
          id: Package.id,
          package_no: Package.package_no,
          description: Package.description,
          package_type_id: Package.package_type_id,
          package_amount: Package.package_amount,
          name: Package.name
        });
        this.isEditMode = true;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }

  deletePackage(id:any) {
    this.hotelServes.deletePackage(id).subscribe(
      (data: any) => {
        this.getPackage();
      },
      (error) => {
        console.error('Error fetching Package:', error);
      }
    );
  }
}
