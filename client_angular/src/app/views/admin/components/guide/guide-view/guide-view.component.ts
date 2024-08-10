import { Component } from '@angular/core';
import {TableDirective} from "@coreui/angular";
import {AllServiceService} from "../../../../../services/all-service.service";

@Component({
  selector: 'app-guide-view',
  standalone: true,
    imports: [
        TableDirective
    ],
  templateUrl: './guide-view.component.html',
  styleUrl: './guide-view.component.scss'
})
export class GuideViewComponent {

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

  ngOnInit() {
    this.getGuides();
  }
}
