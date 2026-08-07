import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {TransportBooking} from "../entities/TransportBooking";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

// private besUrl = 'http://192.168.8.182:8000/api';
  private besUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.get()}`
      })
    };
  }

  paymentSubmit(data: any) {
    return this.http.post(`${this.besUrl}/payments`, data, this.getAuthHeaders());
  }

  paymentUpdate(data: any, id: any) {
    return this.http.put(`${this.besUrl}/payments/${id}`, data, this.getAuthHeaders());
  }

  paymentDelete(data: any) {
    return this.http.delete(`${this.besUrl}/payments/` + data, this.getAuthHeaders());
  }

  paymentGetById(data: any) {
    return this.http.get(`${this.besUrl}/payments/` + data, this.getAuthHeaders());
  }

  paymentGetAll() {
    return this.http.get(`${this.besUrl}/payments`, this.getAuthHeaders());
  }

  paymentMethod() {
    return this.http.get(`${this.besUrl}/paymentMethods`, this.getAuthHeaders());
  }

  paymentStatus() {
    return this.http.get(`${this.besUrl}/paymentStatus`, this.getAuthHeaders());
  }

  getCurrency() {
    return this.http.get(`${this.besUrl}/currencies`, this.getAuthHeaders());
  }
}
