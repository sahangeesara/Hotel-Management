import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    // If token exists, prevent access to the login page by redirecting to dashboard
    if (state.url === '/login') {
      router.navigate(['dashboard']);
      return false;
    }
    // Otherwise, allow access to other routes
    return true;
  } else {
    // If no token, redirect to login for any route except login
    if (state.url !== '/login') {
      router.navigate(['/login']);
      return false;
    }
    // Allow access to the login page if no token
    return true;
  }
};
