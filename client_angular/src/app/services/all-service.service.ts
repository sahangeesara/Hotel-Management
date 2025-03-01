import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from "../entities/employee";
import { Room } from "../entities/room";
import { RoomBook } from "../entities/roomBook";
import { Guest } from "../entities/guest";
import { Guide } from "../entities/guide";
import { User } from "../entities/user";
import { OrderStatus } from "../entities/OrderStatus";
import { FoodStatus } from "../entities/foodStatus";
import { Food } from "../entities/food";
import { Order } from "../entities/order";
import { TokenService } from './token.service';
import {RoomsCategory} from "../entities/roomsCategory";
import {EmployeeType} from "../entities/employeeTypee";
import {Role} from "../entities/Role";
import {Customer} from "../entities/customer";


@Injectable({
  providedIn: 'root'
})
export class AllServiceService {
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

  // **Auth**
  signup(data: any) {
    return this.http.post(`${this.besUrl}/signup`, data);
  }

  login(data: any) {
    return this.http.post(`${this.besUrl}/login`, data);
  }
  sendPasswordResetLink(data:any){
    return this.http.post(`${this.besUrl}/sendPasswordResetLink`,data);
  }
  changePassword(data: any){
    return this.http.post(`${this.besUrl}/resetPassword`,data);

  }
  passwordChange(data: any) {
    return this.http.put(`${this.besUrl}/passwordReset`, data, this.getAuthHeaders());
  }
  userProfile(){
    return this.http.get(`${this.besUrl}/me`, this.getAuthHeaders());

  }

  //Rooms Category
  getRoomsCategory(){
    return this.http.get(`${this.besUrl}/roomsCategory`,this.getAuthHeaders());
  }
  getRoomCategoryById(data:any){
    return this.http.get(`${this.besUrl}/roomsCategory/`+data,this.getAuthHeaders());
  }
  updateRoomCategory(data:any, id:any){
    return this.http.post(`${this.besUrl}/roomsCategory/${id}`,data,this.getAuthHeaders());
  }
  RoomCategoryDelete(data:any){
    return this.http.delete(`${this.besUrl}/roomsCategory/`+data,this.getAuthHeaders());
  }
  submitRoomsCategory(data:any){
    return this.http.post<RoomsCategory[]>(`${this.besUrl}/roomsCategory`,data,this.getAuthHeaders());
  }

  //Rooms Book
  getRoomBook(){
    return this.http.get(`${this.besUrl}/roomBook`,this.getAuthHeaders());
  }
  getRoomBookById(data:any){
    return this.http.get(`${this.besUrl}/roomBook/`+data,this.getAuthHeaders());
  }
  deleteRoomBook(data:any){
    return this.http.delete(`${this.besUrl}/roomBook/`+data,this.getAuthHeaders());
  }
  updateRoomBook(data:any, id:any){
    return this.http.post(`${this.besUrl}/roomBook/${id}`,data,this.getAuthHeaders());
  }
   submitRoomsBook(data:any){
    return this.http.post<RoomBook[]>(`${this.besUrl}/roomBook`,data,this.getAuthHeaders());
  }

  //Rooms
  submitRoom(data:any){
    return this.http.post<Room[]>(`${this.besUrl}/rooms`,data,this.getAuthHeaders());
  }
  getRoom(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.besUrl}/rooms`, this.getAuthHeaders());
  }

  getRoomById(data:any){
    return this.http.get(`${this.besUrl}/rooms/`+data,this.getAuthHeaders());
  }
  deleteRoom(id: any) {
    return this.http.delete(`${this.besUrl}/rooms/${id}`, this.getAuthHeaders());
  }
  roomUpdate(data: any, id: any) {
    console.log(data)
    return this.http.put(`${this.besUrl}/rooms/${id}`, data, this.getAuthHeaders());
  }
  //Genders
  getGenders(){
    return this.http.get(`${this.besUrl}/genders`,this.getAuthHeaders());
  }

  //Employees Types

  getEmployeeTypes(){
    return this.http.get(`${this.besUrl}/employeeTypes`,this.getAuthHeaders());
  }
  getEmployeeTypeById(data:any){
    return this.http.get(`${this.besUrl}/employeeTypes/`+data,this.getAuthHeaders());
  }

  employeeTypesDelete(data:any){
    return this.http.delete(`${this.besUrl}/employeeTypes/`+ data,this.getAuthHeaders());

  }
  updateEmployeeType(data:any, id:any){
    return this.http.post(`${this.besUrl}/employeeTypes/${id}`,data,this.getAuthHeaders());
  }
  submitEmployeeType(data:any){
    return this.http.post<EmployeeType[]>(`${this.besUrl}/employeeTypes`,data,this.getAuthHeaders());
  }
  //Employees
  getEmployees(){
    return this.http.get(`${this.besUrl}/employees`,this.getAuthHeaders());
  }
  updateEmployee(data:any, id:any){
    return this.http.post(`${this.besUrl}/employees/${id}`,data,this.getAuthHeaders());
  }
  getEmployeeById(data:any){
    return this.http.get(`${this.besUrl}/employees/`+ data,this.getAuthHeaders());

  }
  employeeDelete(data:any){
    return this.http.delete(`${this.besUrl}/employees/`+data,this.getAuthHeaders());
  }
  submitEmployee(data:any){
    return this.http.post<Employee[]>(`${this.besUrl}/employees`,data,this.getAuthHeaders());
  }

  //Guest
  getGuests(){
    return this.http.get(`${this.besUrl}/guests`,this.getAuthHeaders());
  }
   submitGuest(data:any){
    return this.http.post<Guest[]>(`${this.besUrl}/guests`,data,this.getAuthHeaders());
  }
  getGuestById(data:any){
    return this.http.get(`${this.besUrl}/guests/`+data,this.getAuthHeaders());
  }
  guestDelete(data:any){
    return this.http.delete(`${this.besUrl}/guests/`+data,this.getAuthHeaders());
  }
  updateGuests(data:any, id:any){
    return this.http.post(`${this.besUrl}/guests/${id}`,data,this.getAuthHeaders());
  }

  //Guide
  getGuide(){
    return this.http.get(`${this.besUrl}/guides`,this.getAuthHeaders());
  }
  getGuideById(data:any){
    return this.http.get(`${this.besUrl}/guides/`+data,this.getAuthHeaders());
  }
  guideDelete(data:any){
    return this.http.delete(`${this.besUrl}/guides/`+data,this.getAuthHeaders());
  }
  submitGuide(data:any){
    return this.http.post<Guide[]>(`${this.besUrl}/guides`,data,this.getAuthHeaders());
  }
  getGuideByAssign(){
    return this.http.get(`${this.besUrl}/getGuide`,this.getAuthHeaders());
  }

  updateGuide(data:any, id:any){
    return this.http.post(`${this.besUrl}/guides/${id}`,data,this.getAuthHeaders());
  }

  //user
  submitUser(data:any){
    return this.http.post<User[]>(`${this.besUrl}/user`,data,this.getAuthHeaders());
  }
  getUser(){
    return this.http.get(`${this.besUrl}/user`,this.getAuthHeaders());
  }

  getUserById(data:any){
    return this.http.get(`${this.besUrl}/user/`+data,this.getAuthHeaders());
  }
  deleteUser(data:any){
    return this.http.delete(`${this.besUrl}/user/`+data,this.getAuthHeaders());
  }
  userUpdate(data:any, id:any){
    console.log(data);
    return this.http.post(`${this.besUrl}/user/${id}`,data,this.getAuthHeaders());
  }

  //order Status

  getOrderStatus(){
    return this.http.get(`${this.besUrl}/orderStatus`,this.getAuthHeaders());
  }
  getOrderStatusById(data:any){
    return this.http.get(`${this.besUrl}/orderStatus/`+data,this.getAuthHeaders());
  }
  deleteOrderStatus(data:any){
    return this.http.delete(`${this.besUrl}/orderStatus/`+data,this.getAuthHeaders());
  }
  submitOrderStatus(data:any){
    return this.http.post<OrderStatus[]>(`${this.besUrl}/orderStatus`,data,this.getAuthHeaders());
  }
  updateOrderStatus(data:any, id:any){
    return this.http.post<OrderStatus>(`${this.besUrl}/orderStatus/${id}`,data,this.getAuthHeaders());
  }

//Food Status

  getFoodStatus(){
    return this.http.get(`${this.besUrl}/foodStatus`,this.getAuthHeaders());
  }
  getFoodStatusById(data:any){
    return this.http.get(`${this.besUrl}/foodStatus/`+data,this.getAuthHeaders());
  }
  deleteFoodStatus(data:any){
    return this.http.delete(`${this.besUrl}/foodStatus/`+data,this.getAuthHeaders());
  }
  submitFoodStatus(data:any){
    return this.http.post<FoodStatus[]>(`${this.besUrl}/foodStatus`,data,this.getAuthHeaders());
  }
 updateFoodStatus(data:any, id:any){
    return this.http.post<FoodStatus>(`${this.besUrl}/foodStatus/${id}`,data,this.getAuthHeaders());
  }

  //Item Category

  getItemCategory(){
    return this.http.get(`${this.besUrl}/itemCategory`,this.getAuthHeaders());
  }
  getItemCategoryById(data:any){
    return this.http.get(`${this.besUrl}/itemCategory/`+data,this.getAuthHeaders());
  }
  deleteItemCategory(data:any){
    return this.http.delete(`${this.besUrl}/itemCategory/`+data,this.getAuthHeaders());
  }
  submitItemCategory(data:any){
    return this.http.post<FoodStatus[]>(`${this.besUrl}/itemCategory`,data,this.getAuthHeaders());
  }
 updateItemCategory(data:any, id:any){
    return this.http.post<FoodStatus>(`${this.besUrl}/itemCategory/${id}`,data,this.getAuthHeaders());
  }
  //Food

  getFood(){
    return this.http.get(`${this.besUrl}/foodItems`,this.getAuthHeaders());
  }
  getFoodById(data:any){
    return this.http.get(`${this.besUrl}/foodItems/`+data,this.getAuthHeaders());
  }
  getFoodByItemCateId(data:any){
    return this.http.get(`${this.besUrl}/foodsByItemCateId/`+data,this.getAuthHeaders());
  }
  deleteFood(data:any){
    return this.http.delete(`${this.besUrl}/foodItems/`+data,this.getAuthHeaders());
  }
  submitFood(data:any){
    return this.http.post<Food[]>(`${this.besUrl}/foodItems`,data,this.getAuthHeaders());
  }
 updateFood(data:any, id:any){
    return this.http.post<Food>(`${this.besUrl}/foodItems/${id}`,data,this.getAuthHeaders());
  }

//Order
  submitOrder(data:any){
    return this.http.post<Order[]>(`${this.besUrl}/orders`,data,this.getAuthHeaders());
  }
  getOrders(){
    return this.http.get(`${this.besUrl}/orders`,this.getAuthHeaders());
  }
  deleteOrders(data:any){
    return this.http.delete(`${this.besUrl}/orders/`+data,this.getAuthHeaders());
  }

  //User Role
  getUserRole(){
    return this.http.get(`${this.besUrl}/role`,this.getAuthHeaders());
  }
  getUserRoleById(data:any){
    return this.http.get(`${this.besUrl}/role/`+data,this.getAuthHeaders());
  }
  updateUserRole(data:any, id:any){
    return this.http.post(`${this.besUrl}/role/${id}`,data,this.getAuthHeaders());
  }
  UserRoleDelete(data:any){
    return this.http.delete(`${this.besUrl}/role/`+data,this.getAuthHeaders());
  }
  submitUserRole(data:any){
    return this.http.post<Role[]>(`${this.besUrl}/role`,data,this.getAuthHeaders());
  }

  //Customer
  getCustomer(){
    return this.http.get(`${this.besUrl}/customer`,this.getAuthHeaders());
  }
  updateCustomer(data:any, id:any){
    return this.http.post(`${this.besUrl}/customer/${id}`,data,this.getAuthHeaders());
  }
  getCustomerById(data:any){
    return this.http.get(`${this.besUrl}/customer/`+ data,this.getAuthHeaders());

  }
  customerDelete(data:any){
    return this.http.delete(`${this.besUrl}/customer/`+data,this.getAuthHeaders());
  }
  submitCustomer(data:any){
    return this.http.post<Customer[]>(`${this.besUrl}/customer`,data,this.getAuthHeaders());
  }
//profile
  getUserProfile(){
    return this.http.get(`${this.besUrl}/userProfile`,this.getAuthHeaders());
  }
  updateUserProfile(data:any, id:any){
    return this.http.post(`${this.besUrl}/userProfile/${id}`,data,this.getAuthHeaders());
  }
  getUserProfileById(data:any){
    return this.http.get(`${this.besUrl}/userProfile/`+ data,this.getAuthHeaders());

  }
  userProfileDelete(data:any){
    return this.http.delete(`${this.besUrl}/userProfile/`+data,this.getAuthHeaders());
  }
  submitUserProfile(data:any){
    return this.http.post<Customer[]>(`${this.besUrl}/userProfile`,data,this.getAuthHeaders());
  }
}


