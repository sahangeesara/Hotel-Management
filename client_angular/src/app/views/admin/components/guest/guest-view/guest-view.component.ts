import { Component } from '@angular/core';
import {TableDirective} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-guest-view',
  standalone: true,
  imports: [
    TableDirective,
    NgIf
  ],
  templateUrl: './guest-view.component.html',
  styleUrl: './guest-view.component.scss'
})
export class GuestViewComponent {

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

  ngOnInit() {
    this.getGuest();
  }
  objectValues(obj: any): any[] {
    return Object.values(obj);
  }
}
