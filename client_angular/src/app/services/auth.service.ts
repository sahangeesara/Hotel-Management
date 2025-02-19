import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isTokenValid());
  authStatus = this.loggedIn.asObservable();

  constructor(
    private token: TokenService,
    private router: Router
  ) {}

  private isTokenValid(): boolean {
    const token = this.token.get();
    if (!token) return false;

    const expiry = this.token.getExpiry();
    if (expiry && expiry < Date.now()) {
      this.logout(); // Centralized logout
      return false;
    }

    return true;
  }

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  logout() {
    this.token.remove();
    this.changeAuthStatus(false);
    this.router.navigate(['/login']);
  }
}
