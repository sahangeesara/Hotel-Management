import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AlertComponent,
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guest-view',
  standalone: true,
  imports: [
    AlertComponent,
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
export class GuestViewComponent implements OnInit {
  @ViewChild(GuestUpdateComponent) guestUpdateComponent: GuestUpdateComponent | undefined;
  @ViewChild(DependentDetailComponent) guestDependComponent: DependentDetailComponent | undefined;

  public visibleDependModal = false;
  public visibleUpdateModal = false;
  public error: any = null;

  guests: any[] = [];
  searchGuestForm: FormGroup;
  guestGenders: any[] = [];
  countries: any[] = [];
  dependentData: any = null;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private searchServe: SearchService,
    private countryService: CuntryService
  ) {
    this.searchGuestForm = this.fb.group({
      gender_id: [''],
      country_id: [''],
      name: [''],
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

  getGuest() {
    this.allServe.getGuests().subscribe({
      next: (response: any) => {
        this.guests = response.data;
        console.log(this.guests);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  guestDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allServe.guestDelete(id).subscribe({
          next: (data: any) => {
            this.getGuest();
            this.showAlert('Guest deleted successfully.', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
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
    this.countryService.getNationality().subscribe({
      next: (response: any) => {
        this.countries = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

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
        this.handleError(error);
      }
    });
  }

  getShow(id: any) {
    this.allServe.getGuestById(id).subscribe({
      next: (data: any) => {
        this.guestUpdateComponent?.getData(data);
        this.toggleUpdateModal();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  search() {
    const filters = {
      name: this.searchGuestForm.get('name')?.value?.trim() || '',
      country_id: this.searchGuestForm.get('country_id')?.value || '',
      gender_id: this.searchGuestForm.get('gender_id')?.value || '',
    };

    if (!filters.name && !filters.country_id && !filters.gender_id) {
      this.getGuest();
      return;
    }

    this.searchServe.getGuestData(filters).subscribe({
      next: (data: any) => {
        this.guests = data;
        if (data.length === 0) {
          this.showAlert('No guests found matching the search criteria.', 'info');
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearSearchForm() {
    Swal.fire({
      title: 'Clear Search Filters?',
      text: "This will reset all search criteria and reload all guests.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.searchGuestForm.reset();
        this.searchGuestForm.patchValue({
          name: '',
          gender_id: '',
          country_id: '',
        });
        this.getGuest();
        this.showAlert('Search filters cleared successfully.', 'success');
      }
    });
  }
  getGuestGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.guestGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  handleError(error: any) {
    console.error('Backend Error:', error);

    // Safely parse Laravel 10 validation or exception payloads
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

  ngOnInit() {
    this.getGuest();
    this.getGuestGen();
    this.getCountries();
  }

  protected readonly Number = Number;
}
