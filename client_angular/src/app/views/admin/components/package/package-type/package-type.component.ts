import {Component, OnInit} from '@angular/core';
import {
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IconDirective} from "@coreui/icons-angular";
import {AllServiceService} from "../../../../../services/all-service.service";
import {HotelService} from "../../../../../services/hotel.service";

@Component({
  selector: 'app-package-type',
  standalone: true,
    imports: [
        ButtonDirective,
        ColComponent,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FormsModule,
        IconDirective,
        ReactiveFormsModule,
        RowComponent,
        TableDirective
    ],
  templateUrl: './package-type.component.html',
  styleUrl: './package-type.component.scss'
})
export class PackageTypeComponent implements OnInit{
  packageTypeForm: FormGroup;
  public error=null;
  isUpdateVisible: boolean = true;
  isSubmitVisible: boolean = false;
  packageTypes: any[] = [];
  formData = new FormData();
  packageTypeData: any;


  constructor(   private allServe: AllServiceService,
                 private  hotelServe: HotelService,
                 private fb: FormBuilder,
  ) {

    this.packageTypeForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
    })
  }

  clearForm() {
    this.packageTypeForm.reset();

  }
  onSubmit() {
    if (this.packageTypeForm.valid) {
      this.packageTypeData = this.packageTypeForm.getRawValue();
      this.hotelServe.submitPackageType(this.packageTypeData).subscribe(
        (response) => {
          // Handle successful submission
          this.getPackageType();
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

  updatePackageType() {
    if (this.packageTypeForm.valid) {
      this.packageTypeData = this.packageTypeForm.getRawValue();

      this.hotelServe.updatePackageType(this.packageTypeData, this.packageTypeData.id).subscribe(
        (response) => {
          // Handle successful response
          this.getPackageType();
          this.clearForm();
          this.isUpdateVisible = true;
          this.isSubmitVisible = false;
        },
        (error) => {
          // Handle error response
          this.handleError(error);
        }
      );
    }
  }

  packageTypeDelete(id:any){
    this.hotelServe.deletePackageType(id).subscribe(
      (data: any) => {
        this.getPackageType();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
    this.isUpdateVisible = true;
    this.isSubmitVisible = false;
  }

  getPackageTypeById(id: any) {
    this.hotelServe.getPackageTypeById(id).subscribe((employeeType: any) => {
      this.isUpdateVisible = false;
      this.isSubmitVisible = true;
      this.packageTypeForm.setValue(employeeType);

    });
  }


  getPackageType() {
    this.hotelServe.getPackageType().subscribe(
      (response: any) => {
        this.packageTypes = response.data ?? response;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }



  ngOnInit() {
    this.getPackageType();
  }

}
