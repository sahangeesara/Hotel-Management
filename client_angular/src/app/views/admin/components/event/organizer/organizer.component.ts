import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {SearchService} from "../../../../../services/search.service";
import {ToastrService} from "ngx-toastr";
import {IconDirective} from "@coreui/icons-angular";
import {EventService} from "../../../../../services/event.service";

@Component({
  selector: 'app-organizer',
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
    RowComponent,
    ButtonDirective,
    IconDirective,
    TableDirective
  ],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.scss'
})
export class OrganizerComponent implements OnInit {
  public visible = false;
  organizers: any[] = [];
  organizerGenders: any[] = [];
  organizerForm:FormGroup;
  public error=null;
  organizerData:any;
  constructor(
    private allServe: AllServiceService,
    private eventServe: EventService,
    private fb: FormBuilder,
    private searchServe: SearchService,
    private toastr: ToastrService,){
    this.organizerForm = this.fb.group({
      id: [''],
      organizer_code: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      nic: ['', [Validators.required]],
    });
  }

  getOrganizer() {
    this.eventServe.getOrganizer().subscribe((response: any) => { this.organizers = response.data;},
      (error) => { console.error('Error fetching supplier:', error); });
  }

  getShow(id:any) {
    this.eventServe.getOrganizerById(id).subscribe(
      (data: any) => {
        this.organizerForm.patchValue({
          id: data.id,
          name: data.name,
          email: data.email,
          address: data.address,
          phone: data.phone,
          gender_id: data.gender_id,
          nic: data.nic,
        });

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }
  clearForm() {
    this.organizerForm.reset();
  }

  organizerDelete(id:any){
    this.eventServe.deleteOrganizer(id).subscribe(
      (data: any) => {
        this.getOrganizer();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

  onSubmit() {
    if (this.organizerForm.valid) {
      this.organizerData = this.organizerForm.getRawValue();
      this.eventServe.submitOrganizer(this.organizerData).subscribe(
        (response) => {
          // Handle successful submission
          this.getOrganizer();
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );
    }
  }
  organizerUpdate(){
    if (this.organizerForm.valid) {

      this.organizerData = this.organizerForm.getRawValue();

      this.eventServe.updateOrganizer(this.organizerData, this.organizerData.id).subscribe(
        (response) => {
          // Handle successful update
          this.clearForm();
        },
        (error) => {
          // Handle errors
          this.handleError(error);
        }
      );

    }
  }
  handleError(error: { error: null; }) {
    return this.error = error.error;
  }

  getOrganizerGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => {
        this.organizerGenders = response.data;
      },
      (error) => {
        console.error('Error fetching employee Gender:', error);
      }
    );
  }
  ngOnInit() {
    this.getOrganizer();
    this.getOrganizerGen();
  }
}
