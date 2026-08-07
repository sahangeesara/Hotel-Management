import {Component, OnInit} from '@angular/core';
import {
  AlertComponent,
  ButtonDirective, ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective, FormTextDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import { IconDirective } from '@coreui/icons-angular';
import {HotelService} from "../../../../../services/hotel.service";
import {SearchService} from "../../../../../services/search.service";

@Component({
  selector: 'app-room-add',
  standalone: true,
  imports: [
    AlertComponent,
    IconDirective,
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    TableDirective,
    NgIf,
    ColComponent,
    RowComponent,
  ],
  templateUrl: './room-add.component.html',
  styleUrl: './room-add.component.scss'
})
export class RoomAddComponent implements OnInit {

  public error: any = null;
  rooms: any[] = [];
  hotels: any[] = [];
  roomsCategories: any[] = [];
  formData = new FormData();
  roomForm: FormGroup;
  roomSearchForm: FormGroup;
  roomData: any;
  isVisible: boolean = false;

  // CoreUI Alert Variables
  alertMessage: string = '';
  alertColor: string = 'success'; // 'success', 'danger', 'warning', 'info'

  constructor(
    private allServe: AllServiceService,
    private hotelServe: HotelService,
    private searchServe: SearchService,
    private fb: FormBuilder,
  ) {
    this.roomForm = this.fb.group({
      id: [''],
      r_no: [''],
      hotel_id: ['', [Validators.required]],
      r_capacity: ['', [Validators.required]],
      r_cost: ['', [Validators.required]],
      r_category_id: ['', Validators.required],
    });

    this.roomSearchForm = this.fb.group({
      hotel_id: [''],
      r_category_id: [''],
      r_no: [''],
      r_capacity: [''],
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

  get rmCategoryField(): FormControl {
    return this.roomForm.controls['r_category_id'] as FormControl;
  }

  clearForm() {
    this.roomForm.reset();
    this.rmCategoryField.setValue('');
    if (this.roomForm.get('r_no')?.disabled) {
      this.roomForm.get('r_no')?.enable();
    }
    this.isVisible = false;
  }

  search() {
    const filters = {
      hotel_id: this.roomSearchForm.get('hotel_id')?.value?.trim() || '',
      r_no: this.roomSearchForm.get('r_no')?.value?.trim() || '',
      r_capacity: this.roomSearchForm.get('r_capacity')?.value?.trim() || '',
      r_category_id: this.roomSearchForm.get('r_category_id')?.value?.trim() || '',
    };

    if (!filters.hotel_id && !filters.r_no && !filters.r_capacity && !filters.r_category_id) {
      this.getRm();
      return;
    }

    this.searchServe.getRoomData(filters).subscribe({
      next: (data: any) => {
        this.rooms = data;
        if (data.length === 0) {
          this.showAlert('No rooms found matching the search criteria.', 'info');
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  clearSearchForm() {
    this.roomSearchForm.reset();
    this.getRm();
    this.roomSearchForm.patchValue({
      hotel_id: '',
      r_no: '',
      r_capacity: '',
      r_category_id: '',
    });
  }

  getRoomById(id: any) {
    this.allServe.getRoomById(id).subscribe({
      next: (room: any) => {
        this.isVisible = true;
        this.roomForm.get('r_no')?.disable();
        this.roomForm.patchValue(room);
        this.showAlert('Room details loaded for update.', 'info');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  updateRoom() {
    if (this.roomForm.valid) {
      this.roomData = this.roomForm.getRawValue();

      this.allServe.roomUpdate(this.roomData, this.roomData.id).subscribe({
        next: (response) => {
          this.getRm();
          this.clearForm();
          this.showAlert('Room updated successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.roomForm.markAllAsTouched();
    }
  }

  getRm() {
    this.allServe.getRoom().subscribe({
      next: (response: any) => {
        this.rooms = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getHotels() {
    this.hotelServe.getHotel().subscribe({
      next: (response: any) => {
        this.hotels = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  onSubmit() {
    if (this.roomForm.valid) {
      this.roomData = this.roomForm.getRawValue();

      this.allServe.submitRoom(this.roomData).subscribe({
        next: (response) => {
          this.getRm();
          this.clearForm();
          this.showAlert('Room created successfully!', 'success');
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      this.roomForm.markAllAsTouched();
    }
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

  deleteRoom(id: any) {
    this.allServe.deleteRoom(id).subscribe({
      next: (data: any) => {
        this.getRm();
        this.showAlert('Room deleted successfully!', 'success');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  getRmCategory() {
    this.allServe.getRoomsCategory().subscribe({
      next: (response: any) => {
        this.roomsCategories = response.data;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  ngOnInit() {
    this.getRm();
    this.getRmCategory();
    this.getHotels();
  }
}
