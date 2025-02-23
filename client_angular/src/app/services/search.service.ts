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

  //Employee Search
  getEmployeeByName(data:any){return this.http.get(`${this.besUrl}/employeesByName/${data}`, this.getAuthHeaders());}
  getEmployeeByGender(data:any){return this.http.get(`${this.besUrl}/employeesByGender/${data}`, this.getAuthHeaders());}
  getEmployeeByType(data:any){return this.http.get(`${this.besUrl}/employeesByType/${data}`,this.getAuthHeaders());}
  getEmployeeByTypeAndGender(type_id:any,gen_id:any){return this.http.get(`${this.besUrl}/employeesByTypeAndGender/${type_id}/${gen_id}`,this.getAuthHeaders());}
  getEmployeeByNameAndGender(e_name:any,gen_id:any){return this.http.get(`${this.besUrl}/employeesByNameAndGender/${e_name}/${gen_id}`,this.getAuthHeaders());}
  getEmployeeByNameAndType(e_name:any,type_id:any){return this.http.get(`${this.besUrl}/employeesByNameAndType/${e_name}/${type_id}`,this.getAuthHeaders());}
  getEmployeeByNameAndTypeAndGender(e_name:any,type_id:any,gen_id:any){return this.http.get(`${this.besUrl}/employeesByNameAndType/${e_name}/${type_id}/${gen_id}`,this.getAuthHeaders());}

  getCountGuest(){return this.http.get(`${this.besUrl}/countGuest`,this.getAuthHeaders());}

  getCountOrder(){return this.http.get(`${this.besUrl}/countOrder`,this.getAuthHeaders());}

  //guest
  getGuestByDate(data:any){
    return this.http.get(`${this.besUrl}/guestByDate/${data}`,this.getAuthHeaders());
  }
  getGuestByGender(data:any){
    return this.http.get(`${this.besUrl}/guestByGender/${data}`,this.getAuthHeaders());
  }


  //Customer

  getAthCustomer(){
    return this.http.get(`${this.besUrl}/athCustomer`,this.getAuthHeaders());
  }

  getCountCustomer() {
    return this.http.get(`${this.besUrl}/countCustomer`,this.getAuthHeaders());

  }
}
