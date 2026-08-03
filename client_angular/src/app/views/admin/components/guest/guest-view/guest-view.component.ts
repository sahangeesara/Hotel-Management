import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ButtonDirective, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective,
  FormTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, RowComponent,
  TableDirective
} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";
import {NgForOf, NgIf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {GuestUpdateComponent} from "../guest-update/guest-update.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {SearchService} from "../../../../../services/search.service";
import {CuntryService} from "../../../../../services/cuntry.service";
import {DependentDetailComponent} from "../dependent-detail/dependent-detail.component";

@Component({
  selector: 'app-guest-view',
  standalone: true,
  imports: [
    GuestUpdateComponent,
    TableDirective,
    NgIf,
    IconDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    RowComponent,
    ColComponent,
    FormLabelDirective,
    FormsModule,
    NgbInputDatepicker,
    ReactiveFormsModule,
    FormDirective,
    FormSelectDirective,
    NgForOf,
    FormControlDirective,
    FormTextDirective,
    DependentDetailComponent
  ],
  templateUrl: './guest-view.component.html',
  styleUrl: './guest-view.component.scss'
})
export class GuestViewComponent implements OnInit{
  @ViewChild(GuestUpdateComponent) guestUpdateComponent : GuestUpdateComponent | undefined;
  @ViewChild(DependentDetailComponent) guestDependComponent : DependentDetailComponent | undefined;

  public visibleDependModal = false;
  public visibleUpdateModal = false;


  guests: any[] = [];
  searchGuestForm:FormGroup
  guestGenders: any[] = [];
  countries: any[] = [];
  dependentData: any = null;

  constructor(  private allServe: AllServiceService,
                private fb: FormBuilder,
                private searchServe: SearchService,
                private countryService: CuntryService

  ) {

    this.searchGuestForm  = this.fb.group({
      gender_id: [''],
      country_id: [''],
      name: [''],

    });
  }


  getGuest() {
    this.allServe.getGuests().subscribe(
      (response: any) => {
        this.guests = response.data;
      },
      (error) => {
        console.error('Error fetching Guest:', error);
      }
    );
  }

  guestDelete(id:any){
    this.allServe.guestDelete(id).subscribe(
      (data: any) => {
        this.getGuest();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

  toggleLiveDependModal() {
    this.visibleDependModal = !this.visibleDependModal;
  }

  handleLiveDependChange(event: boolean) {
    this.visibleDependModal = event;
  }

// --- Guest Update Modal Functions ---
  toggleUpdateModal() {
    this.visibleUpdateModal = !this.visibleUpdateModal;
  }

  handleUpdateModalChange(event: boolean) {
    this.visibleUpdateModal = event;
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
  // Define a variable to hold the dependent data and modal state

  getDependentDetail(id: any) {
    this.allServe.getGuestDependentDetailById(id).subscribe({
      next: (response: any) => {
        this.toggleLiveDependModal();

        setTimeout(() => {
          if (this.guestDependComponent) {
            this.guestDependComponent.getData(response);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching dependent detail:', error);
      }
    });
  }

  getShow(id:any) {
    this.allServe.getGuestById(id).subscribe(
      (data: any) => {

        this.guestUpdateComponent?.getData(data);
        this.toggleUpdateModal();

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }

  search() {
    const filters = {
      name: this.searchGuestForm.get('name')?.value?.trim() || '',
      country_id: this.searchGuestForm.get('country_id')?.value || '',
      gender_id: this.searchGuestForm.get('gender_id')?.value || '',
    };

    if (!filters.name && !filters.country_id && !filters.gender_id  ) {
      this.getGuest();
      return;
    }

    this.searchServe.getGuestData(filters).subscribe({
      next: (data: any) => {
        this.guests = data;
      },
      error: (error) => {
        console.error('Error fetching guest:', error);
      }
    });
  }

  clearSearchForm() {
    this.searchGuestForm.reset();
    this.searchGuestForm.patchValue(  {
      name: '',
      gender_id: '',
      country_id: '',
    });
    this.getGuest();
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



  ngOnInit() {
    this.getGuest();
    this.getGuestGen();
    this.getCountries();
  }


  protected readonly Number = Number;
}
