import { Component } from '@angular/core';
import {TableDirective} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";

@Component({
  selector: 'app-room-view',
  standalone: true,
    imports: [
        TableDirective
    ],
  templateUrl: './room-view.component.html',
  styleUrl: './room-view.component.scss'
})
export class RoomViewComponent {

  rooms: any[] = [];
  constructor(  private allServe: AllServiceService,) {  }
  getRm() {
    this.allServe.getRoom().subscribe(
      (data: any) => {
        this.rooms = data;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }
  ngOnInit() {
    this.getRm();
  }
}
