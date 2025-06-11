// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, shareReplay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  descricion: string;
  proveniencia: string;
  role_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  
  private readonly userId$   = this.currentUser$.pipe(map(u => u?.id ?? null), distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: true }));

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== 'undefined') {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error al parsear el usuario almacenado:', e);
      }
    }
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUserId$(): Observable<number | null> {
    return this.userId$;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
