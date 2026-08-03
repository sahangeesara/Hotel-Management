import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dependent-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dependent-detail.component.html',
  styleUrl: './dependent-detail.component.scss'
})
export class DependentDetailComponent {

  dependentDetails: any = null;

  getData(data: any) {
    this.dependentDetails = data;
  }
}
