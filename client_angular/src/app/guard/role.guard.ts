import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;

  console.log(authService.hasRole(expectedRoles))
  if (authService.hasRole(expectedRoles)) {
    console.log(expectedRoles);
    return true;
  }

  // Redirect unauthorized users to dashboard or login
  router.navigate(['/dashboard']);
  return false;

};
