import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authDictionaryGuard } from './auth-dictionary.guard';

describe('authDictionaryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authDictionaryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
