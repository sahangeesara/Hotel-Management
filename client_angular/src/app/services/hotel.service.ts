import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {Hotel} from "../entities/Hotel";

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
}
