import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import {
  AlertComponent,
  ButtonDirective,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  TableDirective
} from "@coreui/angular";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IconDirective } from "@coreui/icons-angular";
import { AllServiceService } from "../../../../services/all-service.service";
import { TokenService } from "../../../../services/token.service";
import { User } from "../../../../entities/user";
import { map } from "rxjs/operators";
import { from, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    AlertComponent,
    InputGroupComponent,
    FormDirective,
    FormsModule,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    ReactiveFormsModule,
    TableDirective,
    NgForOf,
    NgIf
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: any[] = [];
  rolesList: any[] = []; // Store roles for the table combobox
  public error: any = null;
  formData = new FormData();
  userForm: FormGroup;

  alertMessage: string = '';
  alertColor: string = 'success';

  constructor(
    private allServe: AllServiceService,
    private token: TokenService,
    private fb: FormBuilder,
  ) {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role_id: [''] // Added role_id control
    });
  }

  showAlert(message: string, color: string = 'success') {
    this.alertMessage = message;
    this.alertColor = color;
    setTimeout(() => {
      this.clearAlert();
    }, 4000);
  }

  clearAlert() {
    this.alertMessage = '';
  }

  get userIdField(): FormControl { return this.userForm.controls['id'] as FormControl; }
  get userNameField(): FormControl { return this.userForm.controls['name'] as FormControl; }
  get userEmailField(): FormControl { return this.userForm.controls['email'] as FormControl; }
  get userPasswordField(): FormControl { return this.userForm.controls['password'] as FormControl; }
  get userPasswordConfirmationField(): FormControl { return this.userForm.controls['password_confirmation'] as FormControl; }

  ngOnInit() {
    this.getUser();
    this.loadRoles();
  }

  getUser() {
    this.allServe.getUser().subscribe({
      next: (response: any) => {
        // Map response data to ensure role_id is explicitly assigned from the nested role object
        this.users = (response.data || response).map((u: any) => ({
          ...u,
          role_id: u.role_id || u.role?.id // Fallback to nested role id if role_id is missing
        }));
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  loadRoles() {
    // Fetch roles list from your role resource service endpoint
    this.allServe.getUserRole?.()?.subscribe({
      next: (response: any) => {
        this.rolesList = response.data || response;
      },
      error: (error) => {
        console.error('Failed to load roles', error);
      }
    });
  }

  // Handle live role change from table select dropdown
  onRoleChange(user: any) {
    if (user.role?.name === 'Admin') return; // Safety check

    const payload = {
      role_id: user.role_id
    };

    this.allServe.userRoleUpdate(payload, user.id).subscribe({
      next: () => {
        this.showAlert(`Role updated successfully for ${user.name}`, 'success');
        this.getUser();
      },
      error: (error) => {
        this.handleError(error);
        this.getUser(); // Revert table state on error
      }
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      this.formData = new FormData();
      let user = new User();

      user.name = this.userNameField.value;
      user.password = this.userPasswordField.value;
      user.email = this.userEmailField.value;
      // user.role_id = this.userRoleIdField.value; // Include if handled in entity

      this.formData.append('form', JSON.stringify(user));
      const submissionObservable = from(this.allServe.submitUser(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            this.getUser();
            this.clearForm();
            this.showAlert('User created successfully.', 'success');
            return data;
          }),
          catchError((error) => {
            this.handleError(error);
            return throwError(() => error);
          })
        )
        .subscribe();
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.userForm.markAllAsTouched();
    }
  }

  handleError(error: any) {
    if (error?.error?.errors) {
      const firstKey = Object.keys(error.error.errors)[0];
      this.error = error.error.errors[firstKey][0];
    } else if (error?.error?.message) {
      this.error = error.error.message;
    } else if (typeof error?.error === 'string') {
      this.error = error.error;
    } else {
      this.error = 'An unexpected server error occurred.';
    }
    this.showAlert(this.error || 'An error occurred.', 'danger');
  }

  userDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this user deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allServe.deleteUser(id).subscribe({
          next: () => {
            this.getUser();
            this.showAlert('User deleted successfully.', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  updateUser() {
    if (this.userForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update this user's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.formData = new FormData();
          let user = new User();

          let id = this.userIdField.value;
          user.name = this.userNameField.value;
          user.password = this.userPasswordField.value;
          user.email = this.userEmailField.value;

          this.formData.append('form', JSON.stringify(user));
          this.formData.append('_method', 'patch');

          const submissionObservable = from(this.allServe.userUpdate(this.formData, id));

          submissionObservable
            .pipe(
              map((data) => {
                this.getUser();
                this.clearForm();
                const updatedName = user.name || 'User';
                this.showAlert(`User "${updatedName}" updated successfully.`, 'success');
                return data;
              }),
              catchError((error) => {
                this.handleError(error);
                return throwError(() => error);
              })
            )
            .subscribe();
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.userForm.markAllAsTouched();
    }
  }

  getUserById(id: any) {
    this.allServe.getUserById(id).subscribe({
      next: (user: any) => {
        this.userIdField.setValue(user.id);
        this.userNameField.setValue(user.name);
        this.userEmailField.setValue(user.email);
        this.userPasswordField.setValue('');
        this.userPasswordConfirmationField.setValue('');
        this.showAlert('User details loaded for editing.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearForm() {
    this.userForm.reset();
    this.userIdField.setValue("");
    this.userNameField.setValue("");
    this.userEmailField.setValue("");
    this.userPasswordField.setValue("");
    this.userPasswordConfirmationField.setValue("");
  }
}
