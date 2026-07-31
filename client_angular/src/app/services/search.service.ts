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

  //Customer Search
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

  getGuideData(filters: {
    name?: string;
    tel_no?: number;
    nic?: string;
    gender_id?: number;
  }) {
    const params: any = {};

    if (filters.name) {
      params.name = filters.name;
    }

    if (filters.nic) {
      params.nic = filters.nic;
    }

    if (filters.tel_no) {
      params.tel_no = filters.tel_no;
    }

    if (filters.gender_id) {
      params.gender_id = filters.gender_id;
    }

    return this.http.get(`${this.besUrl}/guide/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  //Hotel Booking Search
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

    return this.http.get(`${this.besUrl}/guest/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  //Hotel Booking Search
  getHotelBookData(filters: {
    hotel_id?: number;
    event_id?: number;
    event_type_id?: number;
    room_id?: number;
    event_date?: string;
  }) {
    const params: any = {};

    if (filters.hotel_id) {
      params.hotel_id = filters.hotel_id;
    }

    if (filters.event_id) {
      params.countevent_idry_id = filters.event_id;
    }

    if (filters.event_type_id) {
      params.event_type_id = filters.event_type_id;
    }

    if (filters.room_id) {
      params.room_id = filters.room_id;
    }
    if (filters.event_date) {
      params.event_date = filters.event_date;
    }

    return this.http.get(`${this.besUrl}/hotelEvent/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  //Transport Booking Search
  getTransportBookData(filters: {
    tour_type_id?: number;
    vehicle_type_id?: number;
    province_id?: number;
    guest_id?: number;
  }) {
    const params: any = {};

    if (filters.tour_type_id) {
      params.tour_type_id = filters.tour_type_id;
    }

    if (filters.vehicle_type_id) {
      params.vehicle_type_id = filters.vehicle_type_id;
    }

    if (filters.province_id) {
      params.province_id = filters.province_id;
    }

    if (filters.guest_id) {
      params.guest_id = filters.guest_id;
    }


    return this.http.get(`${this.besUrl}/transportBook/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }
 //Wedding Booking Search
  getWeddingBookData(filters: {
    hotel_id?: number;
    room_id?: number;
    event_date?: string;
  }) {
    const params: any = {};

    if (filters.hotel_id) {
      params.hotel_id = filters.hotel_id;
    }

    if (filters.room_id) {
      params.room_id = filters.room_id;
    }
    if (filters.event_date) {
      params.event_date = filters.event_date;
    }

    return this.http.get(`${this.besUrl}/weddingEvent/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  //Restaurant Booking Search
  getRestaurantBookData(filters: {
    hotel_id?: number;
    event_id?: number;
    event_type_id?: number;
    room_id?: number;
    event_date?: string;
  }) {
    const params: any = {};

    if (filters.hotel_id) {
      params.hotel_id = filters.hotel_id;
    }

    if (filters.event_id) {
      params.countevent_idry_id = filters.event_id;
    }

    if (filters.event_type_id) {
      params.event_type_id = filters.event_type_id;
    }

    if (filters.room_id) {
      params.room_id = filters.room_id;
    }
    if (filters.event_date) {
      params.event_date = filters.event_date;
    }

    return this.http.get(`${this.besUrl}/restaurantEvent/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  getAthProfile(){
    return this.http.get(`${this.besUrl}/authProfile`,this.getAuthHeaders());
  }


}
