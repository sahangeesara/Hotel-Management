import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ButtonDirective, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent, ModalTitleDirective, RowComponent, TableDirective
} from "@coreui/angular";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";
import {NgForOf, NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {FoodUpdateComponent} from "../food-update/food-update.component";
import { IconDirective } from '@coreui/icons-angular';
import {SearchService} from "../../../../../services/search.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-food-view',
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
    FoodUpdateComponent,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    NgForOf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './food-view.component.html',
  styleUrl: './food-view.component.scss'
})
export class FoodViewComponent implements OnInit {

  @ViewChild(FoodUpdateComponent) foodUpdateComponent: FoodUpdateComponent | undefined;
  foodItems: any[] = [];
  itemCategories: any[] = [];
  foodStatus: any[] = [];
  public visible = false;
  foodSearchForm:FormGroup;
  constructor(
    private allServe: AllServiceService,
    private searchServe: SearchService,
    private fb: FormBuilder,
    private toastr: ToastrService)
  {
    this.foodSearchForm = this.fb.group({
      name: [''],
      item_category_id:[''],
      food_status_id:[''],
    })
  }

  search() {
    const filters = {
      name: this.foodSearchForm.get('name')?.value?.trim() || '',
      item_category_id: this.foodSearchForm.get('item_category_id')?.value?.trim() || '',
      food_status_id: this.foodSearchForm.get('food_status_id')?.value?.trim() || '',
    };

    if (!filters.name && !filters.item_category_id && !filters.food_status_id ) {
      this.getFoodItem();
      return;
    }

    this.searchServe.getFoodData(filters).subscribe({
      next: (response: any) => {
        this.foodItems = response;
        if (response.length === 0) {
          this.toastr.info('No records found for the search criteria.', 'Information');
        }
      },
      error: (error) => {
        console.error('Error fetching Food:', error);
        this.toastr.error('Failed to search food items.', 'Error');
      }
    });
  }

  clearSearchForm() {
    Swal.fire({
      title: 'Clear Search Filters?',
      text: "This will reset search criteria and reload all food items.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.foodSearchForm.reset();
        this.foodSearchForm.patchValue(
          {
            name: '',
            item_category_id: '',
            food_status_id: '',
          }
        );
        this.getFoodItem();
        this.toastr.success('Search filters cleared successfully.', 'Success');
      }
    });
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  getFoodItem() {
    this.allServe.getFood().subscribe(
      (response: any) => {
        this.foodItems = response.data;
      },
      (error) => {
        console.error('Error fetching Food:', error);
        this.toastr.error('Failed to load food items.', 'Error');
      }
    );
  }

  foodDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this food item deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allServe.deleteFood(id).subscribe(
          (data: any) => {
            this.getFoodItem();
            this.toastr.success('Food item deleted successfully!', 'Success');
          },
          (error) => {
            console.error('Error fetching food:', error);
            this.toastr.error('Failed to delete food item.', 'Error');
          }
        );
      }
    });
  }

  getShow(id:any) {
    this.allServe.getFoodById(id).subscribe(
      (data: any) => {
        this.foodUpdateComponent?.getData(data);
        this.toggleLiveDemo();
        this.toastr.info('Food details loaded for updating.', 'Information');
      },
      (error) => {
        console.error('Error fetching food:', error);
        this.toastr.error('Failed to load food details.', 'Error');
      }
    );
  }

  getItemCategory() {
    this.allServe.getItemCategory().subscribe(
      (response: any) => {
        this.itemCategories = response.data;
      },
      (error) => {
        console.error('Error fetching Item Category:', error);
        this.toastr.error('Failed to load item categories.', 'Error');
      }
    );
  }

  getFoodStatus() {
    this.allServe.getFoodStatus().subscribe(
      (response: any) => {
        this.foodStatus = response.data;
      },
      (error) => {
        console.error('Error fetching Food Status:', error);
        this.toastr.error('Failed to load food statuses.', 'Error');
      }
    );
  }

  ngOnInit() {
    this.getItemCategory();
    this.getFoodStatus();
    this.getFoodItem();
  }
}
