import { Injectable } from '@angular/core';
import {TokenService} from "./token.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NationalityEntity} from "../entities/nationalityEntity";
import {CuntryCodeEntity} from "../entities/cuntryCodeEntity";


@Injectable({
  providedIn: 'root'
})
export class CuntryService {

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

  //CountryCode
  getCuntryCode(){
    return this.http.get(`${this.besUrl}/cuntryCode`,this.getAuthHeaders());
  }
  getCuntryCodeById(data:any){
    return this.http.get(`${this.besUrl}/cuntryCode/`+data,this.getAuthHeaders());
  }
  deleteCuntryCode(data:any){
    return this.http.delete(`${this.besUrl}/cuntryCode/`+data,this.getAuthHeaders());
  }
  updateCuntryCode(data:any, id:any){
    return this.http.put(`${this.besUrl}/cuntryCode/${id}`,data,this.getAuthHeaders());
  }
  submitCuntryCodes(data:any){
    return this.http.post<CuntryCodeEntity[]>(`${this.besUrl}/cuntryCode`,data,this.getAuthHeaders());
  }


  //Nationality
  getNationality(){
    return this.http.get(`${this.besUrl}/nationality`,this.getAuthHeaders());
  }
  getNationalityById(data:any){
    return this.http.get(`${this.besUrl}/nationality/`+data,this.getAuthHeaders());
  }
  deleteNationality(data:any){
    return this.http.delete(`${this.besUrl}/nationality/`+data,this.getAuthHeaders());
  }
  updateNationality(data:any, id:any){
    return this.http.put(`${this.besUrl}/nationality/${id}`,data,this.getAuthHeaders());
  }
  submitNationalities(data:any){
    return this.http.post<NationalityEntity[]>(`${this.besUrl}/nationality`,data,this.getAuthHeaders());
  }
}
