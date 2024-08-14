import {Component, ViewChild} from '@angular/core';
import {
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
  TableDirective
} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";
import {NgIf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {GuestUpdateComponent} from "../guest-update/guest-update.component";

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
    ModalTitleDirective
  ],
  templateUrl: './guest-view.component.html',
  styleUrl: './guest-view.component.scss'
})
export class GuestViewComponent {
  @ViewChild(GuestUpdateComponent) guestUpdateComponent : GuestUpdateComponent | undefined;

  public visible = false;


  guests: any[] = [];
  constructor(  private allServe: AllServiceService,) {  }
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





  ngOnInit() {
    this.getGuest();
  }
  objectValues(obj: any): any[] {
    return Object.values(obj);
  }
}
