import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RoomBook} from "../entities/roomBook";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private besUrl ='http://localhost:8000/api';

  constructor(private http:HttpClient) { }

  //Room Booking search
  getRoomBookByDate(data:any){
    return this.http.get(`${this.besUrl}/roomBookByDate/${data}`);
  }
  getRoomBookByRoom(data:any){
    return this.http.get(`${this.besUrl}/roomBookByRoom/${data}`);
  }
  getRoomBookByDateAndRoom(id:any,date:any){
    return this.http.get<RoomBook>(`${this.besUrl}/roomBookByDateAndRoom/${id}/${date}`);
  }

  //Employee Search
  getEmployeeByName(data:any){return this.http.get(`${this.besUrl}/employeesByName/${data}`);}
  getEmployeeByGender(data:any){return this.http.get(`${this.besUrl}/employeesByGender/${data}`);}
  getEmployeeByType(data:any){return this.http.get(`${this.besUrl}/employeesByType/${data}`);}
  getEmployeeByTypeAndGender(type_id:any,gen_id:any){return this.http.get(`${this.besUrl}/employeesByTypeAndGender/${type_id}/${gen_id}`);}
  getEmployeeByNameAndGender(e_name:any,gen_id:any){return this.http.get(`${this.besUrl}/employeesByNameAndGender/${e_name}/${gen_id}`);}
  getEmployeeByNameAndType(e_name:any,type_id:any){return this.http.get(`${this.besUrl}/employeesByNameAndType/${e_name}/${type_id}`);}
  getEmployeeByNameAndTypeAndGender(e_name:any,type_id:any,gen_id:any){return this.http.get(`${this.besUrl}/employeesByNameAndType/${e_name}/${type_id}/${gen_id}`);}

  getCountGuest(){return this.http.get(`${this.besUrl}/countGuest`);}


  //guest
  getGuestByDate(data:any){
    return this.http.get(`${this.besUrl}/guestByDate/${data}`);
  }
  getGuestByGender(data:any){
    return this.http.get(`${this.besUrl}/guestByGender/${data}`);
  }
}
