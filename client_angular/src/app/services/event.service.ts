import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {EventEntity} from "../entities/EventEntity";
import {EventTypeEntity} from "../entities/EventTypeEntity";
import {Organizer} from "../entities/Organizer";

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
    return this.http.post<EventEntity[]>(`${this.besUrl}/event`,data,this.getAuthHeaders());
  }
  //Events Type
  getEventType(){
    return this.http.get(`${this.besUrl}/eventTypes`,this.getAuthHeaders());
  }
  getEventTypeById(data:any){
    return this.http.get(`${this.besUrl}/eventTypes/`+data,this.getAuthHeaders());
  }
  deleteEventType(data:any){
    return this.http.delete(`${this.besUrl}/eventTypes/`+data,this.getAuthHeaders());
  }
  updateEventType(data:any, id:any){
    return this.http.put(`${this.besUrl}/eventTypes/${id}`,data,this.getAuthHeaders());
  }
  submitEventTypes(data:any){
    return this.http.post<EventTypeEntity[]>(`${this.besUrl}/eventTypes`,data,this.getAuthHeaders());
  }

  //Organizer
  getOrganizer(){
    return this.http.get(`${this.besUrl}/organizers`,this.getAuthHeaders());
  }
  getOrganizerById(data:any){
    return this.http.get(`${this.besUrl}/organizers/`+data,this.getAuthHeaders());
  }
  deleteOrganizer(data:any){
    return this.http.delete(`${this.besUrl}/organizers/`+data,this.getAuthHeaders());
  }
  updateOrganizer(data:any, id:any){
    return this.http.put(`${this.besUrl}/organizers/${id}`,data,this.getAuthHeaders());
  }
  submitOrganizer(data:any){
    return this.http.post<Organizer[]>(`${this.besUrl}/organizers`,data,this.getAuthHeaders());
  }
}
