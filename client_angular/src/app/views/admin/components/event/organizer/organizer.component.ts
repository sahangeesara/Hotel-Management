import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
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
import {IconDirective} from "@coreui/icons-angular";
import {EventService} from "../../../../../services/event.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [
    AlertComponent,
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
  organizerForm: FormGroup;
  public error: any = null;
  organizerData: any;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private allServe: AllServiceService,
    private eventServe: EventService,
    private fb: FormBuilder,
    private searchServe: SearchService,
  ) {
    this.organizerForm = this.fb.group({
      id: [''],
      organizer_code: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      nic: ['', [Validators.required]],
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

  getOrganizer() {
    this.eventServe.getOrganizer().subscribe({
      next: (response: any) => {
        this.organizers = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getShow(id: any) {
    this.eventServe.getOrganizerById(id).subscribe({
      next: (data: any) => {
        this.organizerForm.patchValue({
          id: data.id,
          name: data.name,
          email: data.email,
          address: data.address,
          phone: data.phone,
          gender_id: data.gender_id,
          nic: data.nic,
        });
        this.showAlert('Organizer details loaded for update.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearForm() {
    this.organizerForm.reset();
    if (this.organizerForm.disabled) {
      this.organizerForm.enable();
    }
  }

  organizerDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this organizer deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventServe.deleteOrganizer(id).subscribe({
          next: (data: any) => {
            this.getOrganizer();
            this.clearForm();
            this.showAlert('Organizer deleted successfully!', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.organizerForm.valid) {
      Swal.fire({
        title: 'Register Organizer?',
        text: "Do you want to save this new organizer record?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, register!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.organizerData = this.organizerForm.getRawValue();
          this.eventServe.submitOrganizer(this.organizerData).subscribe({
            next: (response) => {
              this.getOrganizer();
              this.clearForm();
              this.showAlert('Organizer registered successfully!', 'success');
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.organizerForm.markAllAsTouched();
    }
  }

  organizerUpdate() {
    if (this.organizerForm.valid) {
      Swal.fire({
        title: 'Update Organizer?',
        text: "Do you want to update this organizer's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.organizerData = this.organizerForm.getRawValue();
          this.eventServe.updateOrganizer(this.organizerData, this.organizerData.id).subscribe({
            next: (response: any) => {
              this.getOrganizer();
              this.clearForm();

              const updatedFields: string[] = [];
              Object.keys(this.organizerForm.controls).forEach(key => {
                const control = this.organizerForm.get(key);
                if (control && control.dirty) {
                  const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  updatedFields.push(formattedName);
                }
              });

              const organizerName = response?.name || this.organizerData.name || 'Organizer';
              if (updatedFields.length > 0) {
                this.showAlert(`Organizer "${organizerName}" updated successfully. Updated fields: ${updatedFields.join(', ')}`, 'success');
              } else {
                this.showAlert(`Organizer "${organizerName}" updated successfully.`, 'success');
              }
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.organizerForm.markAllAsTouched();
    }
  }

  checkNicAndSetGender(nic: string) {
    if (!nic) return;
    const cleanNic = nic.replace(/\s+/g, '');

    // Handle 10-character NIC (Old format: YYDOVXXXXX)
    if (cleanNic.length === 10) {
      const nicPrefix = parseInt(cleanNic.substring(2, 5), 10);
      if (!isNaN(nicPrefix)) {
        this.organizerForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }
      const val = parseInt(cleanNic.substring(0, 2), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number("19" + val);
      const age = currentYear - birthYear;

      if (age < 17) {
        this.organizerForm.disable();
        this.showAlert('Organizer is under 17 years old. Form locked.', 'warning');
      }
    }
    // Handle 12-character NIC (New format: YYYYDOVXXXXX)
    else if (cleanNic.length === 12) {
      const nicPrefix = parseInt(cleanNic.substring(4, 7), 10);
      if (!isNaN(nicPrefix)) {
        this.organizerForm.patchValue({
          gender_id: nicPrefix > 500 ? '2' : '1'
        }, { emitEvent: false });
      }

      const val = parseInt(cleanNic.substring(0, 5), 10);
      const currentYear = new Date().getFullYear();
      const birthYear = Number(val);
      const age = currentYear - birthYear;

      if (age < 17) {
        this.organizerForm.disable();
        this.showAlert('Organizer is under 17 years old. Form locked.', 'warning');
      }
    }
  }

  handleError(error: any) {
    console.error('Backend Error:', error);

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

  getOrganizerGen() {
    this.allServe.getGenders().subscribe({
      next: (response: any) => {
        this.organizerGenders = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  ngOnInit() {
    this.getOrganizer();
    this.getOrganizerGen();
    this.organizerForm.get('nic')?.valueChanges.subscribe(nicValue => {
      if (nicValue) {
        this.checkNicAndSetGender(nicValue);
      }
    });
  }
}
