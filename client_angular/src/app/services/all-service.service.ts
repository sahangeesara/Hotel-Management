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
import {OrderStatus} from "../entities/OrderStatus";
import {FoodStatus} from "../entities/foodStatus";
import {Food} from "../entities/food";

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

  //Rooms Category
  getRoomsCategory(){
    return this.http.get(`${this.besUrl}/roomsCategory`);
  }
  getRoomCategoryById(data:any){
    return this.http.get(`${this.besUrl}/roomsCategory/`+data);
  }
  updateRoomCategory(data:any, id:any){
    return this.http.post(`${this.besUrl}/roomsCategory/${id}`,data);
  }
  RoomCategoryDelete(data:any){
    return this.http.delete(`${this.besUrl}/roomsCategory/`+data);
  }
  submitRoomsCategory(data:any){
    return this.http.post<RoomsCategory[]>(`${this.besUrl}/roomsCategory`,data);
  }

  //Rooms Book
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
    return this.http.post(`${this.besUrl}/roomBook/${id}`,data);
  }
   submitRoomsBook(data:any){
    return this.http.post<RoomBook[]>(`${this.besUrl}/roomBook`,data);
  }

  //Rooms
  submitRoom(data:any){
    return this.http.post<Room[]>(`${this.besUrl}/rooms`,data);
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
    return this.http.post(`${this.besUrl}/rooms/${id}`,data);
  }

  //Genders
  getGenders(){
    return this.http.get(`${this.besUrl}/genders`);
  }

  //Employees Types

  getEmployeeTypes(){
    return this.http.get(`${this.besUrl}/employeeTypes`);
  }
  getEmployeeTypeById(data:any){
    return this.http.get(`${this.besUrl}/employeeTypes/`+data);
  }

  employeeTypesDelete(data:any){
    return this.http.delete(`${this.besUrl}/employeeTypes/`+ data);

  }
  updateEmployeeType(data:any, id:any){
    return this.http.post(`${this.besUrl}/employeeTypes/${id}`,data);
  }
  submitEmployeeType(data:any){
    return this.http.post<EmployeeType[]>(`${this.besUrl}/employeeTypes`,data);
  }
  //Employees
  getEmployees(){
    return this.http.get(`${this.besUrl}/employees`);
  }
  updateEmployee(data:any, id:any){
    return this.http.post(`${this.besUrl}/employees/${id}`,data);
  }
  getEmployeeById(data:any){
    return this.http.get(`${this.besUrl}/employees/`+ data);

  }
  employeeDelete(data:any){
    return this.http.delete(`${this.besUrl}/employees/`+data);
  }
  submitEmployee(data:any){
    return this.http.post<Employee[]>(`${this.besUrl}/employees`,data);
  }

  //Guest
  getGuests(){
    return this.http.get(`${this.besUrl}/guests`);
  }
   submitGuest(data:any){
    return this.http.post<Guest[]>(`${this.besUrl}/guests`,data);
  }
  getGuestById(data:any){
    return this.http.get(`${this.besUrl}/guests/`+data);
  }
  guestDelete(data:any){
    return this.http.delete(`${this.besUrl}/guests/`+data);
  }
  updateGuests(data:any, id:any){
    return this.http.post(`${this.besUrl}/guests/${id}`,data);
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
  submitGuide(data:any){
    return this.http.post<Guide[]>(`${this.besUrl}/guides`,data);
  }
  getGuideByAssign(){
    return this.http.get(`${this.besUrl}/getGuide`);
  }

  updateGuide(data:any, id:any){
    return this.http.post(`${this.besUrl}/guides/${id}`,data);
  }

  //user
  submitUser(data:any){
    return this.http.post<User[]>(`${this.besUrl}/user`,data);
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
    return this.http.post(`${this.besUrl}/user/${id}`,data);
  }

  //order Status

  getOrderStatus(){
    return this.http.get(`${this.besUrl}/orderStatus`);
  }
  getOrderStatusById(data:any){
    return this.http.get(`${this.besUrl}/orderStatus/`+data);
  }
  deleteOrderStatus(data:any){
    return this.http.delete(`${this.besUrl}/orderStatus/`+data);
  }
  submitOrderStatus(data:any){
    return this.http.post<OrderStatus[]>(`${this.besUrl}/orderStatus`,data);
  }
  updateOrderStatus(data:any, id:any){
    return this.http.post<OrderStatus>(`${this.besUrl}/orderStatus/${id}`,data);
  }

//Food Status

  getFoodStatus(){
    return this.http.get(`${this.besUrl}/foodStatus`);
  }
  getFoodStatusById(data:any){
    return this.http.get(`${this.besUrl}/foodStatus/`+data);
  }
  deleteFoodStatus(data:any){
    return this.http.delete(`${this.besUrl}/foodStatus/`+data);
  }
  submitFoodStatus(data:any){
    return this.http.post<FoodStatus[]>(`${this.besUrl}/foodStatus`,data);
  }
 updateFoodStatus(data:any, id:any){
    return this.http.post<FoodStatus>(`${this.besUrl}/foodStatus/${id}`,data);
  }

  //Item Category

  getItemCategory(){
    return this.http.get(`${this.besUrl}/itemCategory`);
  }
  getItemCategoryById(data:any){
    return this.http.get(`${this.besUrl}/itemCategory/`+data);
  }
  deleteItemCategory(data:any){
    return this.http.delete(`${this.besUrl}/itemCategory/`+data);
  }
  submitItemCategory(data:any){
    return this.http.post<FoodStatus[]>(`${this.besUrl}/itemCategory`,data);
  }
 updateItemCategory(data:any, id:any){
    return this.http.post<FoodStatus>(`${this.besUrl}/itemCategory/${id}`,data);
  }
  //Food

  getFood(){
    return this.http.get(`${this.besUrl}/foodItems`);
  }
  getFoodById(data:any){
    return this.http.get(`${this.besUrl}/foodItems/`+data);
  }
  getFoodByItemCateId(data:any){
    return this.http.get(`${this.besUrl}/foodsByItemCateId/`+data);
  }
  deleteFood(data:any){
    return this.http.delete(`${this.besUrl}/foodItems/`+data);
  }
  submitFood(data:any){
    return this.http.post<Food[]>(`${this.besUrl}/foodItems`,data);
  }
 updateFood(data:any, id:any){
    return this.http.post<Food>(`${this.besUrl}/foodItems/${id}`,data);
  }



}


