import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {TransportBooking} from "../entities/TransportBooking";

@Injectable({
  providedIn: 'root'
})
export class TravelBookingService {

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

//TransportBookings
  getTransportBookings(){
    return this.http.get(`${this.besUrl}/transportBooking`,this.getAuthHeaders());
  }
  getTransportBookingsById(data:any){
    return this.http.get(`${this.besUrl}/transportBooking/`+data,this.getAuthHeaders());
  }
  deleteTransportBookings(data:any){
    return this.http.delete(`${this.besUrl}/transportBooking/`+data,this.getAuthHeaders());
  }
  updateTransportBookings(data:any, id:any){
    return this.http.put(`${this.besUrl}/transportBooking/${id}`,data,this.getAuthHeaders());
  }
  submitTransportBookings(data:any){
    return this.http.post<TransportBooking[]>(`${this.besUrl}/transportBooking`,data,this.getAuthHeaders());
  }

//ServiceTypes
  getServiceTypes(){
    return this.http.get(`${this.besUrl}/serviceTypes`,this.getAuthHeaders());
  }
  getServiceTypesById(data:any){
    return this.http.get(`${this.besUrl}/serviceTypes/`+data,this.getAuthHeaders());
  }
  deleteServiceTypes(data:any){
    return this.http.delete(`${this.besUrl}/serviceTypes/`+data,this.getAuthHeaders());
  }
  updateServiceTypes(data:any, id:any){
    return this.http.put(`${this.besUrl}/serviceTypes/${id}`,data,this.getAuthHeaders());
  }
  submitServiceTypes(data:any){
    return this.http.post<TransportBooking[]>(`${this.besUrl}/serviceTypes`,data,this.getAuthHeaders());
  }

//VehicleTypes
  getVehicleTypes(){
    return this.http.get(`${this.besUrl}/vehicleTypes`,this.getAuthHeaders());
  }
  getVehicleTypesById(data:any){
    return this.http.get(`${this.besUrl}/vehicleTypes/`+data,this.getAuthHeaders());
  }
  deleteVehicleTypes(data:any){
    return this.http.delete(`${this.besUrl}/vehicleTypes/`+data,this.getAuthHeaders());
  }
  updateVehicleTypes(data:any, id:any){
    return this.http.put(`${this.besUrl}/vehicleTypes/${id}`,data,this.getAuthHeaders());
  }
  submitVehicleTypes(data:any){
    return this.http.post<TransportBooking[]>(`${this.besUrl}/vehicleTypes`,data,this.getAuthHeaders());
  }

  //TourType
  getTourType(){
    return this.http.get(`${this.besUrl}/tourType`,this.getAuthHeaders());
  }
  getTourTypeById(data:any){
    return this.http.get(`${this.besUrl}/tourType/`+data,this.getAuthHeaders());
  }
  deleteTourType(data:any){
    return this.http.delete(`${this.besUrl}/tourType/`+data,this.getAuthHeaders());
  }
  updateTourType(data:any, id:any){
    return this.http.put(`${this.besUrl}/tourType/${id}`,data,this.getAuthHeaders());
  }
  submitTourType(data:any){
    return this.http.post<TransportBooking[]>(`${this.besUrl}/tourType`,data,this.getAuthHeaders());
  }

  //Durations
  getDurations(){
    return this.http.get(`${this.besUrl}/durations`,this.getAuthHeaders());
  }
  getDurationsById(data:any){
    return this.http.get(`${this.besUrl}/durations/`+data,this.getAuthHeaders());
  }
  deleteDurations(data:any){
    return this.http.delete(`${this.besUrl}/durations/`+data,this.getAuthHeaders());
  }
  updateDurations(data:any, id:any){
    return this.http.put(`${this.besUrl}/durations/${id}`,data,this.getAuthHeaders());
  }
  submitDurations(data:any){
    return this.http.post<TransportBooking[]>(`${this.besUrl}/durations`,data,this.getAuthHeaders());
  }


  //provinces
  getProvinces(){
    return this.http.get(`${this.besUrl}/provinces`,this.getAuthHeaders());
  }
}
