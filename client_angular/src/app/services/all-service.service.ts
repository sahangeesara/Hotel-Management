import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../entities/employee";
import {EmployeeType} from "../entities/employeeTypee";
import {Room} from "../entities/room";
import {RoomsCategory} from "../entities/roomsCategory";
import {RoomBook} from "../entities/roomBook";
import {Guest} from "../entities/guest";
import {Guide} from "../entities/guide";

@Injectable({
  providedIn: 'root'
})
export class AllServiceService {
  private besUrl ='http://localhost:8000/api';
  constructor(private http:HttpClient) { }
  //Auth
  signup(data:any){
    return this.http.post(`${this.besUrl}/signup`,data);
  }
  login(data:any){
    return this.http.post(`${this.besUrl}/login`,data);
  }
  sendPasswordResetLink(data:any){
    return this.http.post(`${this.besUrl}/sendPasswordResetLink`,data);
  }
  changePassword(data: any){
    return this.http.post(`${this.besUrl}/resetPassword`,data);

  }
  passwordChange(data: any){
    return this.http.post(`${this.besUrl}/passwordReset`,data);

  }

  //Rooms
  getRoomsCategory(){
    return this.http.get(`${this.besUrl}/roomsCategory`);
  }
  async submitRoomsCategory(data:any){
    return this.http.post<RoomsCategory[]>(`${this.besUrl}/roomsCategory`,data).toPromise();
  }
  getRoomBook(){
    return this.http.get(`${this.besUrl}/roomBook`);
  }
  async submitRoomsBook(data:any){
    return this.http.post<RoomBook[]>(`${this.besUrl}/roomBook`,data).toPromise();
  }
  async submitRoom(data:any){
    return this.http.post<Room[]>(`${this.besUrl}/rooms`,data).toPromise();
  }
  getRoom(){
    return this.http.get(`${this.besUrl}/rooms`);
  }
  //Genders
  getGenders(){
    return this.http.get(`${this.besUrl}/genders`);
  }
  //Employees
  getEmployees(){
    return this.http.get(`${this.besUrl}/employees`);
  }
  getEmployeeTypes(){
    return this.http.get(`${this.besUrl}/employeeTypes`);
  }
  async submitEmployee(data:any){
    return this.http.post<Employee[]>(`${this.besUrl}/employees`,data).toPromise();
  }
  async submitEmployeeType(data:any){
    return this.http.post<EmployeeType[]>(`${this.besUrl}/employeeTypes`,data).toPromise();
  }
  //Guest
  getGuests(){
    return this.http.get(`${this.besUrl}/guests`);
  }
  async submitGuest(data:any){
    return this.http.post<Guest[]>(`${this.besUrl}/guests`,data).toPromise();
  }

  //Guide
  getGuide(){
    return this.http.get(`${this.besUrl}/guides`);
  }
  async submitGuide(data:any){
    return this.http.post<Guide[]>(`${this.besUrl}/guides`,data).toPromise();
  }
}


