import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { IconDirective } from '@coreui/icons-angular';
import {
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormTextDirective,
    RowComponent,
  TableDirective
} from "@coreui/angular";
import {Role} from "../../../../entities/Role";
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-role',
  standalone: true,
    imports: [
        ButtonDirective,
        ColComponent,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FormsModule,
        ReactiveFormsModule,
        RowComponent,
        TableDirective,
      FormTextDirective,
      IconDirective
    ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  userRoles: any[] = [];
  formData = new FormData();
  userRoleForm: FormGroup;
  public error=null;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,

  ){
    this.userRoleForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
    });


  }

  get userRoleIdField(): FormControl {
    return this.userRoleForm.controls['id'] as FormControl;
  }


  get userRoleNameField(): FormControl {
    return this.userRoleForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.userRoleNameField.setValue("");
    this.userRoleIdField.setValue("");

  }
  onSubmit() {
    this.formData = new FormData();
    if (this.userRoleForm.valid) {

      let role = new Role();

      role.name= this.userRoleNameField.value;

      this.formData.append('form', JSON.stringify(role));
      const submissionObservable = from( this.allServe.submitUserRole(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRole();
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

  updateRole() {
    this.formData = new FormData();
    let id;
    if (this.userRoleForm.valid) {

      let role = new Role();

      id = this.userRoleIdField.value;

      role.id = this.userRoleIdField.value;
      role.name = this.userRoleNameField.value;

      this.formData.append('form', JSON.stringify(role));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateUserRole(this.formData,id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getRole();
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

  RoleDelete(id:any){
    this.allServe.UserRoleDelete(id).subscribe(
      (data: any) => {
        this.getRole();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

  getRoleById(id:any) {
    this.allServe.getUserRoleById(id).subscribe(
      (employeeType:any) => {

        this.userRoleIdField.setValue(employeeType.id);
        this.userRoleNameField.setValue(employeeType.name);
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }


  getRole() {
    this.allServe.getUserRole().subscribe(
      (response: any) => {
        this.userRoles = response.data;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }


  ngOnInit() {
    this.getRole();
  }

}
