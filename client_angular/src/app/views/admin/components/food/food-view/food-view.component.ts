import {Component, ViewChild} from '@angular/core';
import {
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent, ModalTitleDirective, TableDirective
} from "@coreui/angular";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";
import {NgIf} from "@angular/common";
import {AllServiceService} from "../../../../../services/all-service.service";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {FoodUpdateComponent} from "../food-update/food-update.component";
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-food-view',
  standalone: true,
  imports: [
    IconDirective,
    ButtonDirective,
    EmployeeUpdateComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NgIf,
    TableDirective,
    FoodUpdateComponent
  ],
  templateUrl: './food-view.component.html',
  styleUrl: './food-view.component.scss'
})
export class FoodViewComponent {

  @ViewChild(FoodUpdateComponent) foodUpdateComponent: FoodUpdateComponent | undefined;
  foodItems: any[] = [];
  public visible = false;

  constructor(
    private allServe: AllServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService,) {
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


  ngOnInit() {
    this.getFoodItem();
  }
}
