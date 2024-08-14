import {Component, ViewChild} from '@angular/core';
import {
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
  TableDirective
} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";
import { IconDirective } from '@coreui/icons-angular';
import {GuideUpdateComponent} from "../guide-update/guide-update.component";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";

@Component({
  selector: 'app-guide-view',
  standalone: true,
  imports: [
    GuideUpdateComponent,
    IconDirective,
    TableDirective,
    ButtonDirective,
    EmployeeUpdateComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective
  ],
  templateUrl: './guide-view.component.html',
  styleUrl: './guide-view.component.scss'
})
export class GuideViewComponent {
  @ViewChild(GuideUpdateComponent) guideUpdateComponent : GuideUpdateComponent | undefined;

  public visible = false;

  guides: any[] = [];
  constructor(  private allServe: AllServiceService,) {  }
  getGuides() {
    this.allServe.getGuide().subscribe(
      (response: any) => {
        this.guides = response.data;
      },
      (error) => {
        console.error('Error fetching Guide:', error);
      }
    );
  }

  guideDelete(id:any){
    this.allServe.guideDelete(id).subscribe(
      (data: any) => {
        this.getGuides();
      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );

  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  getShow(id:any) {
    this.allServe.getGuideById(id).subscribe(
      (data: any) => {

        this.guideUpdateComponent?.getData(data);
        this.toggleLiveDemo();

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }



  ngOnInit() {
    this.getGuides();
  }
}
