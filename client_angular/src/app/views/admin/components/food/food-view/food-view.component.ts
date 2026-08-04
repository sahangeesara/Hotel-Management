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
      },
      error: (error) => {
        console.error('Error fetching Food:', error);
      }
    });
  }

  clearSearchForm() {
    this.foodSearchForm.reset();
    this.getFoodItem();
    this.foodSearchForm.patchValue(
      {
        name: '',
        item_category_id: '',
        food_status_id: '',
      }
    )
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
      }
    );
  }

  foodDelete(id: any) {
    this.allServe.deleteFood(id).subscribe(
      (data: any) => {
        this.getFoodItem();
      },
      (error) => {
        console.error('Error fetching food:', error);
      }
    );
  }

  getShow(id:any) {
    this.allServe.getFoodById(id).subscribe(
      (data: any) => {

        this.foodUpdateComponent?.getData(data);
        this.toggleLiveDemo();

      },
      (error) => {
        console.error('Error fetching food:', error);
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
      }
    );
  }


  ngOnInit() {
    this.getItemCategory();
    this.getFoodStatus();
    this.getFoodItem();
  }
}
