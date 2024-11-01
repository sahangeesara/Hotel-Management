import {Component, ViewChild} from '@angular/core';
import {
  ButtonDirective, ColComponent, FormDirective, FormLabelDirective, FormSelectDirective,
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
    NgForOf
  ],
  templateUrl: './guest-view.component.html',
  styleUrl: './guest-view.component.scss'
})
export class GuestViewComponent {
  @ViewChild(GuestUpdateComponent) guestUpdateComponent : GuestUpdateComponent | undefined;

  public visible = false;


  guests: any[] = [];
  searchGuestForm:FormGroup
  guestGenders: any[] = [];

  constructor(  private allServe: AllServiceService,
                private fb: FormBuilder,
                private searchServe: SearchService,

  ) {

    this.searchGuestForm  = this.fb.group({
      search_Date: [''],
      gender_id: [''],

    });
  }

  get searchDateField(): FormControl {
    return this.searchGuestForm.controls['search_Date'] as FormControl;
  }
  get searchGuestGenderField(): FormControl {
    return this.searchGuestForm.controls['gender_id'] as FormControl;
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

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  getShow(id:any) {
    this.allServe.getGuestById(id).subscribe(
      (data: any) => {

        this.guestUpdateComponent?.getData(data);
        this.toggleLiveDemo();

      },
      (error) => {
        console.error('Error fetching employee:', error);
      }
    );
  }
  formatDate(obj:any){
    return obj['year']+'-'+obj['month']+'-'+obj['day']
  }
  search() {
    let val = this.searchDateField.value;
    let g_gender_id = this.searchGuestGenderField.value;

    if (val) {
      let date =this.formatDate(val);
      // Only date is provided, use the date-based search
      this.searchServe.getGuestByDate(date).subscribe(
        (data: any) => {
          this.guests = data;
        },
        (error) => {
          console.error('Error fetching rooms Book:', error);
        }
      );
    }
    else if(g_gender_id && !(val)){
      this.searchServe.getGuestByGender(g_gender_id).subscribe(
        (data: any) => { this.guests = data; },
        (error) => {console.error('Error fetching Guest gender:', error);});
    }
  }
  clearSearchForm() {
    this.searchDateField.setValue("");
    this.searchGuestGenderField.setValue("Select a Gender");
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
  }
  objectValues(obj: any): any[] {
    return Object.values(obj);
  }


}
