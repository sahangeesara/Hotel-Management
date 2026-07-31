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
import { IconDirective } from '@coreui/icons-angular';
import {GuideUpdateComponent} from "../guide-update/guide-update.component";
import {EmployeeUpdateComponent} from "../../employee/employee-update/employee-update.component";
import {SearchService} from "../../../../../services/search.service";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-guide-view',
  standalone: true,
  imports: [
    GuideUpdateComponent,
    IconDirective,
    TableDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    NgForOf,
    ReactiveFormsModule,
    RowComponent
  ],
  templateUrl: './guide-view.component.html',
  styleUrl: './guide-view.component.scss'
})
export class GuideViewComponent implements OnInit {
  @ViewChild(GuideUpdateComponent) guideUpdateComponent : GuideUpdateComponent | undefined;

  public visible = false;
  formData = new FormData();
  guideSearchForm: FormGroup;
  guideGenders: any[] = [];
  guides: any[] = [];
  constructor(  private allServe: AllServiceService, private searchServe: SearchService, private fb: FormBuilder,)
  {
    this.guideSearchForm = this.fb.group({
        name: [''],
        nic:[''],
        tel_no:[''],
        gender_id:[''],
    })

  }

  getGuideGen() {
    this.allServe.getGenders().subscribe(
      (response: any) => { this.guideGenders = response.data; },
      (error) => { console.error('Error fetching guide Gender:', error); });
  }

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
  search() {
    const filters = {
      name: this.guideSearchForm.get('name')?.value?.trim() || '',
      nic: this.guideSearchForm.get('nic')?.value?.trim() || '',
      gender_id: this.guideSearchForm.get('gender_id')?.value?.trim() || '',
      tel_no: this.guideSearchForm.get('tel_no')?.value?.trim() || '',

    };

    // If no filters, load all employees
    if (!filters.name && !filters.tel_no && !filters.nic && !filters.gender_id) {
      this.getGuides();
      return;
    }

    this.searchServe.getGuideData(filters).subscribe({
      next: (data: any) => {
        this.guides = data;
      },
      error: (error) => {
        console.error('Error fetching guide:', error);
      }
    });
  }

  clearSearchForm() {
    this.guideSearchForm.reset();
    this.guideSearchForm.patchValue(  {
      gender_id: '',
    });
    this.getGuides();
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
    this.getGuideGen();
  }
}
