import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';

export const authDictionaryGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let userID = -1;
  
  authService.currentUser$.subscribe(user => {
      if (!user) router.navigate(['/login']);
      if (user) userID = user.id;
  });

  if (userID !== -1) {
    return true;
  } else {
    router.navigate(['/login']); 
  }
  return false;
};
