import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,FormTextDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {OrderStatus} from "../../../../../entities/OrderStatus";
import { IconDirective } from '@coreui/icons-angular';
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    IconDirective,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormTextDirective,
    FormLabelDirective,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    TableDirective
  ],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss'
})
export class OrderStatusComponent {

  orderStatuses: any[] = [];
  formData = new FormData();
  orderStatusForm: FormGroup;
  public error=null;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.orderStatusForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
    });

  }

  get orderStIdField(): FormControl {
    return this.orderStatusForm.controls['id'] as FormControl;
  }


  get orderStNameField(): FormControl {
    return this.orderStatusForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.orderStNameField.setValue("");

  }
 onSubmit() {
    this.formData = new FormData();
    if (this.orderStatusForm.valid) {

      let ordSt = new OrderStatus();

      ordSt.name= this.orderStNameField.value;
      console.log(ordSt)
      this.formData.append('form', JSON.stringify(ordSt));
      const submissionObservable = from( this.allServe.submitOrderStatus(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getOrdSt();
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
  orderStatusUpdate() {
    this.formData = new FormData();
    let id;
    if (this.orderStatusForm.valid) {

      let ordSt = new OrderStatus();

      id = this.orderStIdField.value;

      ordSt.name = this.orderStIdField.value;
      ordSt.name = this.orderStNameField.value;

      this.formData.append('form', JSON.stringify(ordSt));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateOrderStatus(this.formData,id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getOrdSt();
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

  orderStatusDelete(id:any){
    this.allServe.deleteOrderStatus(id).subscribe(
      (data: any) => {
        this.getOrdSt();
      },
      (error) => {
        console.error('Error fetching order status:', error);
      }
    );

  }

  getOrdStById(id:any) {
    this.allServe.getOrderStatusById(id).subscribe(
      (orderStatus:any) => {

        this.orderStIdField.setValue(orderStatus.id);
        this.orderStNameField.setValue(orderStatus.name);
      },
      (error) => {
        console.error('Error fetching order status:', error);
      }
    );
  }


  getOrdSt() {
    this.allServe.getOrderStatus().subscribe(
      (response: any) => {
        this.orderStatuses = response.data;
      },
      (error) => {
        console.error('Error fetching order status:', error);
      }
    );
  }


  ngOnInit() {
    this.getOrdSt();
  }
}
