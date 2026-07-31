import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

// private besUrl = 'http://192.168.8.182:8000/api';
  private besUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.get()}`
      })
    };
  }

  //Count
  getCountOrder(){return this.http.get(`${this.besUrl}/countOrder`,this.getAuthHeaders());}
  getCountGuest(){return this.http.get(`${this.besUrl}/countGuest`,this.getAuthHeaders());}
  getCountCustomer() {return this.http.get(`${this.besUrl}/countCustomer`,this.getAuthHeaders());}
  getCountRoomBooking() {return this.http.get(`${this.besUrl}/roomBookingCount`,this.getAuthHeaders());}

  getBookingChart(type: string = 'Month') {
    return this.http.get<any>(
      `${this.besUrl}/dashboard/booking-chart?type=${type}`,
      this.getAuthHeaders()
    );
  }

  getBookingIncome() {
    return this.http.get<any>(
      `${this.besUrl}/dashboard/booking-income`,
      this.getAuthHeaders()
    );
  }
}
