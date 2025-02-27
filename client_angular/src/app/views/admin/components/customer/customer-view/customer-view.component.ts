import {Component, ViewChild} from '@angular/core';
import {
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent, ModalTitleDirective, TableDirective
} from "@coreui/angular";
import {NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {FormBuilder} from "@angular/forms";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";
import {CustomerUpdateComponent} from "../customer-update/customer-update.component";
import {IconDirective} from "@coreui/icons-angular";

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [
    IconDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NgIf,
    TableDirective,
    CustomerUpdateComponent
  ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent {
  public visible = false;
  customers: any[] = [];
  customGenders: any[] = [];
  @ViewChild(CustomerUpdateComponent) customerUpdateComponent : CustomerUpdateComponent | undefined;
  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private searchServe: SearchService,
    private toastr: ToastrService,){}
  handleLiveDemoChange(event: any) { this.visible = event; }
  toggleLiveDemo() { this.visible = !this.visible;}

  getCustom() {
    this.allServe.getCustomer().subscribe((response: any) => { this.customers = response.data;},
      (error) => { console.error('Error fetching supplier:', error); });
  }

  getShow(id:any) {
    this.allServe.getCustomerById(id).subscribe(
      (data: any) => {

        this.customerUpdateComponent?.getData(data);
        this.toggleLiveDemo();

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }
  customerDelete(id:any){
    this.allServe.customerDelete(id).subscribe(
      (data: any) => {
        this.getCustom();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }
  ngOnInit() { this.getCustom();    }
}
