import { Component } from '@angular/core';
import {
  ButtonCloseDirective,
  ButtonDirective,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IconDirective} from "@coreui/icons-angular";
import {Router, RouterLink} from "@angular/router";
import {AllServiceService} from "../../../../services/all-service.service";
import {TokenService} from "../../../../services/token.service";
import {ToastrService} from "ngx-toastr";
import {Guest} from "../../../../entities/guest";
import {User} from "../../../../entities/user";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    InputGroupComponent,
    FormDirective,
    FormsModule,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    RouterLink,
    ReactiveFormsModule,
    TableDirective,
    ModalHeaderComponent,
    ModalComponent,
    ModalBodyComponent,
    ModalTitleDirective,
    ModalFooterComponent,
    ButtonCloseDirective
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  users: any[] = [];

  formData = new FormData();
  userForm: FormGroup;
  constructor(private  allServe:AllServiceService,
              private token: TokenService,
              private toastr: ToastrService,
              private router: Router,
              private fb: FormBuilder,
              )
  {
    this.userForm = this.fb.group({

      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

    });
  }
  get userIdField(): FormControl {
    return this.userForm.controls['id'] as FormControl;
  }
  get userNameField(): FormControl {
    return this.userForm.controls['name'] as FormControl;
  }
  get userEmailField(): FormControl {
    return this.userForm.controls['email'] as FormControl;
  }
  get userPasswordField(): FormControl {
    return this.userForm.controls['password'] as FormControl;
  }
  get userPasswordConfirmationField(): FormControl {
    return this.userForm.controls['password_confirmation'] as FormControl;
  }
  async onSubmit() {
    this.formData = new FormData();
    if (this.userForm.valid) {
      let user = new User();

      user.name= this.userNameField.value;
      user.password= this.userPasswordField.value;
      user.email= this.userEmailField.value;


      this.formData.append('form', JSON.stringify(user));
      await this.allServe.submitUser(this.formData);
      this.clearForm();
    }
  }

  getUser() {
    this.allServe.getUser().subscribe(
      (response: any) => {
        this.users = response.data;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }
  userDelete(id:any){
    this.allServe.deleteUser(id).subscribe(
      (data: any) => {
        this.getUser();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }
  updateUser(){
    // console.log(this.userForm.value)
    // if (this.userForm.valid) {
    //   this.allServe.passwordChange(this.userForm.value).subscribe(
    //
    //   )
    //
    // }
  }

  getUserById(id:any) {
    this.allServe.getUserById(id).subscribe(
      (user:any) => {

        this.userIdField.setValue(user.id);
        this.userNameField.setValue(user.name);
        this.userEmailField.setValue(user.email)
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }




  ngOnInit() {
    this.getUser();
  }
   clearForm() {
     this.userNameField.setValue("");
     this.userEmailField.setValue("");
     this.userPasswordField.setValue("");
     this.userPasswordConfirmationField.setValue("");
  }
}
