import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Optional: if role is inside your JWT claims

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
      this.logout();
      return false;
    }

    return true;
  }

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  // --- RBAC HELPER METHODS ---

  getRole(): string | null {
    const token = this.token.get();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role || null; // Match the claim key sent from Laravel
    } catch (error) {
      return null;
    }
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRole = this.getRole();
    return userRole ? allowedRoles.includes(userRole) : false;
  }

  // auth.service.ts
  getUserRole(): string | null {
    const token = this.token.get();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || null;
    } catch (error) {
      return null;
    }
  }

  logout() {
    this.token.remove();
    this.changeAuthStatus(false);
    this.router.navigate(['/login']);
  }
}
