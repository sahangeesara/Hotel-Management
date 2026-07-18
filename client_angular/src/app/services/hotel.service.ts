import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {Hotel} from "../entities/Hotel";
import {RoomSetup} from "../entities/RoomSetup";

@Injectable({
  providedIn: 'root'
})
export class HotelService {

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

  //Hotels
  getHotel(){
    return this.http.get(`${this.besUrl}/hotels`,this.getAuthHeaders());
  }
  getHotelById(data:any){
    return this.http.get(`${this.besUrl}/hotels/`+data,this.getAuthHeaders());
  }
  deleteHotel(data:any){
    return this.http.delete(`${this.besUrl}/hotels/`+data,this.getAuthHeaders());
  }
  updateHotel(data:any, id:any){
    return this.http.put(`${this.besUrl}/hotels/${id}`,data,this.getAuthHeaders());
  }
  submitHotel(data:any){
    return this.http.post<Hotel[]>(`${this.besUrl}/hotels`,data,this.getAuthHeaders());
  }
  //roomSetup
  getRoomSetup(){
    return this.http.get(`${this.besUrl}/roomSetup`,this.getAuthHeaders());
  }
  getRoomSetupById(data:any){
    return this.http.get(`${this.besUrl}/roomSetup/`+data,this.getAuthHeaders());
  }
  deleteRoomSetup(data:any){
    return this.http.delete(`${this.besUrl}/roomSetup/`+data,this.getAuthHeaders());
  }
  updateRoomSetup(data:any, id:any){
    return this.http.put(`${this.besUrl}/roomSetup/${id}`,data,this.getAuthHeaders());
  }
  submitRoomSetup(data:any){
    return this.http.post<RoomSetup[]>(`${this.besUrl}/roomSetup`,data,this.getAuthHeaders());
  }

  //package
  getPackage(){
    return this.http.get(`${this.besUrl}/package`,this.getAuthHeaders());
  }
  getPackageById(data:any){
    return this.http.get(`${this.besUrl}/package/`+data,this.getAuthHeaders());
  }
  deletePackage(data:any){
    return this.http.delete(`${this.besUrl}/package/`+data,this.getAuthHeaders());
  }
  updatePackage(data:any, id:any){
    return this.http.put(`${this.besUrl}/package/${id}`,data,this.getAuthHeaders());
  }
  submitPackage(data:any){
    return this.http.post<RoomSetup[]>(`${this.besUrl}/package`,data,this.getAuthHeaders());
  }

  //package
  getPackageType(){
    return this.http.get(`${this.besUrl}/packageTypes`,this.getAuthHeaders());
  }
  getPackageTypeById(data:any){
    return this.http.get(`${this.besUrl}/packageTypes/`+data,this.getAuthHeaders());
  }
  deletePackageType(data:any){
    return this.http.delete(`${this.besUrl}/packageTypes/`+data,this.getAuthHeaders());
  }
  updatePackageType(data:any, id:any){
    return this.http.put(`${this.besUrl}/packageTypes/${id}`,data,this.getAuthHeaders());
  }
  submitPackageType(data:any){
    return this.http.post<RoomSetup[]>(`${this.besUrl}/packageTypes`,data,this.getAuthHeaders());
  }

  //sections
  getSections(){
    return this.http.get(`${this.besUrl}/section`,this.getAuthHeaders());
  }
  getSectionsById(data:any){
    return this.http.get(`${this.besUrl}/section/`+data,this.getAuthHeaders());
  }
  deleteSections(data:any){
    return this.http.delete(`${this.besUrl}/section/`+data,this.getAuthHeaders());
  }
  updateSections(data:any, id:any){
    return this.http.put(`${this.besUrl}/section/${id}`,data,this.getAuthHeaders());
  }
  submitSections(data:any){
    return this.http.post<RoomSetup[]>(`${this.besUrl}/section`,data,this.getAuthHeaders());
  }


}
