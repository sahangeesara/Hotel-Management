import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders } from "@angular/common/http";
import {RoomBook} from "../entities/roomBook";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private besUrl ='http://localhost:8000/api';
  // private besUrl ='http://192.168.8.182:8000/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.get()}`
      })
    };
  }

  //Room Booking search
  getRoomBookByDate(data:any){
    return this.http.get(`${this.besUrl}/roomBookByDate/${data}`, this.getAuthHeaders());
  }
  getRoomBookByRoom(data:any){
    return this.http.get(`${this.besUrl}/roomBookByRoom/${data}`, this.getAuthHeaders());
  }
  getRoomBookByDateAndRoom(id:any,date:any){
    return this.http.get<RoomBook>(`${this.besUrl}/roomBookByDateAndRoom/${id}/${date}`, this.getAuthHeaders());
  }

  getEmployees(filters: {
    name?: string;
    employee_type_id?: number;
    gender_id?: number;
  }) {
    const params: any = {};

    if (filters.name) {
      params.name = filters.name;
    }

    if (filters.employee_type_id) {
      params.employee_type_id = filters.employee_type_id;
    }

    if (filters.gender_id) {
      params.gender_id = filters.gender_id;
    }

    return this.http.get(`${this.besUrl}/employees/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }




//order Search/Count
  getCountOrder(){return this.http.get(`${this.besUrl}/countOrder`,this.getAuthHeaders());}

  //guest  Search/Count
  getGuestByDate(data:any){
    return this.http.get(`${this.besUrl}/guestByDate/${data}`,this.getAuthHeaders());
  }
  getGuestByGender(data:any){
    return this.http.get(`${this.besUrl}/guestByGender/${data}`,this.getAuthHeaders());
  }
  getCountGuest(){return this.http.get(`${this.besUrl}/countGuest`,this.getAuthHeaders());}


  //Customer Search/Count

  getCustomer(filters: {
    name?: string;
    country_id?: number;
    gender_id?: number;
  }) {
    const params: any = {};

    if (filters.name) {
      params.name = filters.name;
    }

    if (filters.country_id) {
      params.country_id = filters.country_id;
    }

    if (filters.gender_id) {
      params.gender_id = filters.gender_id;
    }

    return this.http.get(`${this.besUrl}/customer/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }
  getGuestData(filters: {
    name?: string;
    country_id?: number;
    gender_id?: number;
    search_Date?: string;
  }) {
    const params: any = {};

    if (filters.name) {
      params.name = filters.name;
    }

    if (filters.country_id) {
      params.country_id = filters.country_id;
    }

    if (filters.gender_id) {
      params.gender_id = filters.gender_id;
    }
    if (filters.search_Date) {
      params.search_Date = filters.search_Date;
    }

    return this.http.get(`${this.besUrl}/guest/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  getAthProfile(){
    return this.http.get(`${this.besUrl}/authProfile`,this.getAuthHeaders());
  }

  getCountCustomer() {
    return this.http.get(`${this.besUrl}/countCustomer`,this.getAuthHeaders());

  }
  getCountRoomBooking() {
    return this.http.get(`${this.besUrl}/roomBookingCount`,this.getAuthHeaders());

  }
}
