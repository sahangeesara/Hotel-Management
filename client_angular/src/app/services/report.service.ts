import { Injectable } from '@angular/core';
import {TokenService} from "./token.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  // private besUrl = 'http://192.168.8.182:8000/api';
  private besUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.get()}`
      })
    };
  }
  getMonthlyBookingReport() {
    return this.http.get<any>(`${this.besUrl}/reports/monthly-booking`,this.getAuthHeaders());
  }

  bookingTrendReport(){
    return this.http.get<any>(`${this.besUrl}/reports/bookingTrendReport`,this.getAuthHeaders());

  }

  ordersReport(){
    return this.http.get<any>(`${this.besUrl}/reports/orderReport`,this.getAuthHeaders());

  }

  eventBookingReport() {
    return this.http.get<any>(`${this.besUrl}/reports/eventBookReport`,this.getAuthHeaders());

  }

  travelBookingTrendReport() {
    return this.http.get<any>(`${this.besUrl}/reports/travelBookingTrendReport`,this.getAuthHeaders());
  }


  transportVehicleReport() {
    return this.http.get<any>(`${this.besUrl}/reports/transportVehicleReport`,this.getAuthHeaders());
   }
   incomeRevenueReport() {
    return this.http.get<any>(`${this.besUrl}/reports/incomeRevenueReport`,this.getAuthHeaders());
   }
  paymentCollectionReport() {
    return this.http.get<any>(`${this.besUrl}/reports/paymentCollectionReport`,this.getAuthHeaders());
   }
}
