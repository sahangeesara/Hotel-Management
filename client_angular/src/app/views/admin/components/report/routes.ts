import { Routes } from '@angular/router';
import {MonthlyBookingReportComponent} from "./monthly-booking-report/monthly-booking-report.component";

export const routes: Routes = [
  {
    path: 'booking_room_report',
    loadComponent: () => import('./monthly-booking-report/monthly-booking-report.component').then(m => m.MonthlyBookingReportComponent),
    data: {
      title: 'Booking Room Report View'
    }
  },
  {
    path: 'booking_room_trend_report',
    loadComponent: () => import('./booking-room-trend-report/booking-room-trend-report.component').then(m => m.BookingRoomTrendReportComponent),
    data: {
      title: 'Booking Room Trend Report View'
    },
  },
  {
    path: 'orders_report',
    loadComponent: () => import('./monthly-food-orders-report/monthly-food-orders-report.component').then(m => m.MonthlyFoodOrdersReportComponent),
    data: {
      title: 'Monthly Food Orders Report View'
    },
  },
  {
    path: 'booking_event_report',
    loadComponent: () => import('./event-booking-report/event-booking-report.component').then(m => m.EventBookingReportComponent),
    data: {
      title: '. Event Booking Report View'
    },
  },
  {
    path: 'booking_travel_report',
    loadComponent: () => import('./travel-booking-report/travel-booking-report.component').then(m => m.TravelBookingReportComponent),
    data: {
      title: 'Travel Booking Report View'
    },
  },
  {
    path: 'income_report',
    loadComponent: () => import('./income-and-revenue-report/income-and-revenue-report.component').then(m => m.IncomeAndRevenueReportComponent),
    data: {
      title: 'Income & Revenue Report View'
    },
  },
  {
    path: 'payment_report',
    loadComponent: () => import('./payment-collection-report/payment-collection-report.component').then(m => m.PaymentCollectionReportComponent),
    data: {
      title: 'Payment Collection Report View'
    },
  },
];
