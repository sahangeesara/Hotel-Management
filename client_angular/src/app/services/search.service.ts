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

  getHotelData(filters: {
    name?: string;
    phone?: number;
    room_setups_id?: string;
    capacity?: number;
  }) {
    const params: any = {};

    if (filters.name) {
      params.name = filters.name;
    }

    if (filters.phone) {
      params.phone = filters.phone;
    }

    if (filters.room_setups_id) {
      params.room_setups_id = filters.room_setups_id;
    }

    if (filters.capacity) {
      params.capacity = filters.capacity;
    }

    return this.http.get(`${this.besUrl}/hotel/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

 getRoomData(filters: {
    r_no?: string;
    hotel_id?: number;
    r_capacity?: string;
    r_category_id?: number;
  }) {
    const params: any = {};

    if (filters.r_no) {
      params.r_no = filters.r_no;
    }

    if (filters.hotel_id) {
      params.hotel_id = filters.hotel_id;
    }

    if (filters.r_capacity) {
      params.r_capacity = filters.r_capacity;
    }

    if (filters.r_category_id) {
      params.r_category_id = filters.r_category_id;
    }

    return this.http.get(`${this.besUrl}/room/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

 getRoomBookData(filters: {
   guest_id?: string;
   package_id?: number;
   booking_Date?: string;
  }) {
    const params: any = {};

    if (filters.guest_id) {
      params.guest_id = filters.guest_id;
    }

    if (filters.package_id) {
      params.package_id = filters.package_id;
    }

    if (filters.booking_Date) {
      params.booking_Date = filters.booking_Date;
    }

    return this.http.get(`${this.besUrl}/roomBook/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  getFoodData(filters: {
    name?: string;
    item_category_id?: number;
    food_status_id?: string;
  }) {
    const params: any = {};

    if (filters.name) {
      params.name = filters.name;
    }

    if (filters.item_category_id) {
      params.item_category_id = filters.item_category_id;
    }

    if (filters.food_status_id) {
      params.food_status_id = filters.food_status_id;
    }

    return this.http.get(`${this.besUrl}/foods/search`, {
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
