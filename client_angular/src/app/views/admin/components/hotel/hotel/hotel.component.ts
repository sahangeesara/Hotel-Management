import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HotelService} from "../../../../../services/hotel.service";
import {
  AlertComponent,
  ButtonDirective,
  ColComponent,
  FormControlDirective, FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {NgForOf, NgIf} from "@angular/common";
import {SearchService} from "../../../../../services/search.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    IconDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    FormDirective,
  ],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.scss'
})
export class HotelComponent implements OnInit {
  public error: any = null;
  hotels: any[] = [];
  roomSetups: any[] = [];
  formData = new FormData();
  hotelForm: FormGroup;
  hotelSearchForm: FormGroup;
  hotelData: any;
  public isEditMode = false;
  isUpdateVisible: boolean = true;
  isSubmitVisible: boolean = false;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private hotelServe: HotelService,
    private searchServe: SearchService,
    private fb: FormBuilder,
  ) {
    this.hotelForm = this.fb.group({
      id: [''],
      hotel_no: [''],
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      room_setups_id: ['', [Validators.required]],
      capacity: ['', [Validators.required]]
    });

    this.hotelSearchForm = this.fb.group({
      name: [''],
      phone: [''],
      room_setups_id: [''],
      capacity: [''],
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

  clearForm() {
    this.hotelForm.reset();
    this.isEditMode = false;
    this.isUpdateVisible = true;
    this.isSubmitVisible = false;
  }

  getHotelById(id: any) {
    this.hotelServe.getHotelById(id).subscribe({
      next: (hotel: any) => {
        this.isUpdateVisible = false;
        this.isSubmitVisible = true;
        this.hotelForm.patchValue(hotel);
        this.isEditMode = true;
        this.showAlert('Hotel details loaded for update.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  updateHotel() {
    if (this.hotelForm.valid) {
      Swal.fire({
        title: 'Update Hotel?',
        text: "Do you want to update this hotel's details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.hotelData = this.hotelForm.getRawValue();

          this.hotelServe.updateHotel(this.hotelData, this.hotelData.id).subscribe({
            next: (response: any) => {
              this.getHotel();
              this.clearForm();
              this.isUpdateVisible = true;
              this.isSubmitVisible = false;

              const updatedFields: string[] = [];
              Object.keys(this.hotelForm.controls).forEach(key => {
                const control = this.hotelForm.get(key);
                if (control && control.dirty) {
                  const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  updatedFields.push(formattedName);
                }
              });

              const hotelName = response?.name || this.hotelData.name || 'Hotel';
              if (updatedFields.length > 0) {
                this.showAlert(`Hotel "${hotelName}" updated successfully. Updated fields: ${updatedFields.join(', ')}`, 'success');
              } else {
                this.showAlert(`Hotel "${hotelName}" updated successfully.`, 'success');
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
      this.hotelForm.markAllAsTouched();
    }
  }

  search() {
    const filters = {
      name: this.hotelSearchForm.get('name')?.value?.trim() || '',
      phone: this.hotelSearchForm.get('phone')?.value?.trim() || '',
      room_setups_id: this.hotelSearchForm.get('room_setups_id')?.value?.trim() || '',
      capacity: this.hotelSearchForm.get('capacity')?.value?.trim() || '',
    };

    if (!filters.name && !filters.phone && !filters.room_setups_id && !filters.capacity) {
      this.getHotel();
      return;
    }

    this.searchServe.getHotelData(filters).subscribe({
      next: (data: any) => {
        this.hotels = data;
        if (data.length === 0) {
          this.showAlert('No hotels found matching the search criteria.', 'info');
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
      text: "This will reset search criteria and reload all hotels.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotelSearchForm.reset();
        this.hotelSearchForm.patchValue({
          name: '',
          phone: '',
          room_setups_id: '',
          capacity: '',
        });
        this.getHotel();
        this.showAlert('Search filters cleared successfully.', 'success');
      }
    });
  }

  getHotel() {
    this.hotelServe.getHotel().subscribe({
      next: (response: any) => {
        this.hotels = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getRoomSetup() {
    this.hotelServe.getRoomSetup().subscribe({
      next: (response: any) => {
        this.roomSetups = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      Swal.fire({
        title: 'Create Hotel?',
        text: "Do you want to save this new hotel record?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, create it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.hotelData = this.hotelForm.getRawValue();

          this.hotelServe.submitHotel(this.hotelData).subscribe({
            next: (response) => {
              this.getHotel();
              this.clearForm();
              this.showAlert('Hotel created successfully!', 'success');
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.hotelForm.markAllAsTouched();
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

  deleteHotel(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this hotel deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotelServe.deleteHotel(id).subscribe({
          next: (data: any) => {
            this.isUpdateVisible = true;
            this.isSubmitVisible = false;
            this.getHotel();
            this.showAlert('Hotel deleted successfully!', 'success');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.getHotel();
    this.getRoomSetup();
  }
}
