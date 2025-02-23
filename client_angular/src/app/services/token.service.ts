import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private iss={
    // login : 'http://192.168.8.182:8000/api/login',
    // signup : 'http://192.168.8.182:8000/api/signup',
    login : 'http://localhost:8000/api/login',
    signup : 'http://localhost:8000/api/api/signup'
  };
  constructor() { }
  handle(token: any){
    this.set(token);


  }
  set(token: any){
    localStorage.setItem('token',token);
  }
  get(){
    return localStorage.getItem('token');
  }
  remove(){
    localStorage.removeItem('token');
  }

  isValid() {
    const token =this.get();
    if(this.get()){
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.iss).includes(payload.iss);
      }

    }
    return false;
  }

  payload(token: any) {
    const  payload= token.split('.')[1];
    return this.decode(payload);
  }
  decode(payload: any){
    return JSON.parse(atob(payload));
  }

  loggedIn(){
    return this.isValid();
  }

  getExpiry(): number | null {
    const token = this.get();
    if (!token) return null;

    const payload = this.payload(token);
    if (payload && payload.exp) {
      return payload.exp * 1000; // Convert to milliseconds
    }

    return null;
  }

}
