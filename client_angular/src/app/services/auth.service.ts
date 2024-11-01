import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TokenService} from "./token.service";
import {Route, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn =new BehaviorSubject<boolean>(this.token.loggedIn());
  authStatus =this.loggedIn.asObservable();

  changeAuthStatus(value: boolean)
  {
    this.loggedIn.next(value);
  }



  constructor(
    private token:TokenService,
    private router:Router
  ) { }

  logout() {
    this.token.remove()
    this.router.navigate(['/login'])
  }
}
