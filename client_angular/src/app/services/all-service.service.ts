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
  getRoomByBooking(){
    return this.http.get(`${this.besUrl}/getRoom`);
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
  async updateEmployee(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/employees/${id}`);
    console.log('all-Ser')
    return this.http.put(`${this.besUrl}/employees/${id}`,data).toPromise();
  }

  async updateEmployeeType(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/employeeTypes/${id}`);
    console.log('all-Ser')
    return this.http.put(`${this.besUrl}/employeeTypes/${id}`,data).toPromise();
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
  getGuideByAssign(){
    return this.http.get(`${this.besUrl}/getGuide`);
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
  async submitOrderStatus(data:any){
    return this.http.post<OrderStatus[]>(`${this.besUrl}/orderStatus`,data).toPromise();
  }
  updateOrderStatus(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/orderStatus/${id}`);
    console.log('all-Ser')
    return this.http.patch<OrderStatus>(`${this.besUrl}/orderStatus/${id}`,data);
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
  async submitFoodStatus(data:any){
    return this.http.post<FoodStatus[]>(`${this.besUrl}/foodStatus`,data).toPromise();
  }
 async updateFoodStatus(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/foodStatus/${id}`);
    console.log('all-Ser')
    return this.http.patch<FoodStatus>(`${this.besUrl}/foodStatus/${id}`,data);
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
  async submitItemCategory(data:any){
    return this.http.post<FoodStatus[]>(`${this.besUrl}/itemCategory`,data).toPromise();
  }
 updateItemCategory(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/itemCategory/${id}`);
    console.log('all-Ser')
    return this.http.patch<FoodStatus>(`${this.besUrl}/itemCategory/${id}`,data);
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
  async submitFood(data:any){
    return this.http.post<Food[]>(`${this.besUrl}/foodItems`,data).toPromise();
  }
 async updateFood(data:any, id:any){
    console.log(data);
    console.log(`${this.besUrl}/foodItems/${id}`);
    console.log('all-Ser')
    return this.http.put<Food>(`${this.besUrl}/foodItems/${id}`,data).toPromise();
  }



}


