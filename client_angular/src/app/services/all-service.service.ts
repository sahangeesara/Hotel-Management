import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../entities/employee";
import {EmployeeType} from "../entities/employeeTypee";
import {Room} from "../entities/room";
import {RoomsCategory} from "../entities/roomsCategory";
import {RoomBook} from "../entities/roomBook";
import {Guest} from "../entities/guest";
import {Guide} from "../entities/guide";
import {User} from "../entities/user";

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
    return this.http.put(`${this.besUrl}/passwordReset`,data);

  }

  //Rooms
  getRoomsCategory(){
    return this.http.get(`${this.besUrl}/roomsCategory`);
  }
  getRoomCategoryById(data:any){
    return this.http.get(`${this.besUrl}/roomsCategory/`+data);
  }
  updateRoomCategory(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/roomsCategory/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/roomsCategory/${id}`,data);
  }
  RoomCategoryDelete(data:any){
    return this.http.delete(`${this.besUrl}/roomsCategory/`+data);
  }
  async submitRoomsCategory(data:any){
    return this.http.post<RoomsCategory[]>(`${this.besUrl}/roomsCategory`,data).toPromise();
  }
  getRoomBook(){
    return this.http.get(`${this.besUrl}/roomBook`);
  }
  getRoomBookById(data:any){
    return this.http.get(`${this.besUrl}/roomBook/`+data);
  }
  deleteRoomBook(data:any){
    return this.http.delete(`${this.besUrl}/roomBook/`+data);
  }
  updateRoomBook(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/roomBook/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/roomBook/${id}`,data);
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
  getRoomById(data:any){
    return this.http.get(`${this.besUrl}/rooms/`+data);
  }
  deleteRoom(data:any){
    return this.http.delete(`${this.besUrl}/rooms/`+data);
  }
  updateRoom(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/rooms/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/rooms/${id}`,data);
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

  getEmployeeById(data:any){
    return this.http.get(`${this.besUrl}/employees/`+ data);

  }
  employeeTypesDelete(data:any){
    return this.http.delete(`${this.besUrl}/employeeTypes/`+ data);

  }
  updateEmployee(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/employees/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/employees/${id}`,data);
  }

  updateEmployeeType(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/employeeTypes/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/employeeTypes/${id}`,data);
  }

  getEmployeeTypeById(data:any){
    return this.http.get(`${this.besUrl}/employeeTypes/`+data);
  }
  employeeDelete(data:any){
    return this.http.delete(`${this.besUrl}/employees/`+data);
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
  getGuestById(data:any){
    return this.http.get(`${this.besUrl}/guests/`+data);
  }
  guestDelete(data:any){
    return this.http.delete(`${this.besUrl}/guests/`+data);
  }
  updateGuests(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/guests/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/guests/${id}`,data);
  }

  //Guide
  getGuide(){
    return this.http.get(`${this.besUrl}/guides`);
  }
  getGuideById(data:any){
    return this.http.get(`${this.besUrl}/guides/`+data);
  }
  guideDelete(data:any){
    return this.http.delete(`${this.besUrl}/guides/`+data);
  }
  async submitGuide(data:any){
    return this.http.post<Guide[]>(`${this.besUrl}/guides`,data).toPromise();
  }
  updateGuide(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/guides/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/guides/${id}`,data);
  }

  //user
  async submitUser(data:any){
    return this.http.post<User[]>(`${this.besUrl}/user`,data).toPromise();
  }
  getUser(){
    return this.http.get(`${this.besUrl}/user`);
  }

  getUserById(data:any){
    return this.http.get(`${this.besUrl}/user/`+data);
  }
  deleteUser(data:any){
    return this.http.delete(`${this.besUrl}/user/`+data);
  }
  userUpdate(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/user/${id}`);
    console.log('all-Ser')
    return this.http.patch(`${this.besUrl}/user/${id}`,data);
  }
}


