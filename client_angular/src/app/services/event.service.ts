import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class EventService {
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

  //Events
  getEvent(){
    return this.http.get(`${this.besUrl}/event`,this.getAuthHeaders());
  }
  getEventById(data:any){
    return this.http.get(`${this.besUrl}/event/`+data,this.getAuthHeaders());
  }
  deleteEvent(data:any){
    return this.http.delete(`${this.besUrl}/event/`+data,this.getAuthHeaders());
  }
  updateEvent(data:any, id:any){
    return this.http.put(`${this.besUrl}/event/${id}`,data,this.getAuthHeaders());
  }
  submitEvents(data:any){
    return this.http.post<Event[]>(`${this.besUrl}/event`,data,this.getAuthHeaders());
  }
}
