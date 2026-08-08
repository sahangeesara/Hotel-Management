import {Component, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent, INavData,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import {AuthService} from "../../services/auth.service";

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;

  public filteredNavItems: INavData[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();

    this.filteredNavItems = navItems.filter(item => {
      // Restrict these items ONLY if the logged-in user is a Receptionist
      if (role === 'Receptionist') {
        const restrictedNames = [
          'User',
          'Employee',
          'User Role',
          'Status/Category',
          'Room Category',
          'Employee Type',
          'Order Status',
          'Food Status',
          'Item Category',
          'Report',
          'Booking Room Report',
          'Room Trend Report',
          'Orders Report',
          'Event Booking Report',
          'Travel Booking Report',
          'Income & Revenue Report',
          'Payment Collection Report'
        ];

        // Added check: ensure item.name is defined before calling includes()
        if (item.name && restrictedNames.includes(item.name)) {
          return false;
        }
      }

      return true;
    });
  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
