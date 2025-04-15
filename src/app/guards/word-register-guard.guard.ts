import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';

export const wordRegisterGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.currentUser$.pipe(
    take(1), // toma la primera emisión y completa el observable
    map(user => {
      if (user) {
        // Si el usuario está autenticado, permite el acceso a la ruta solicitada
        return true;
      } else {
        // Si no está autenticado, redirige a '/login' y devuelve false
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
