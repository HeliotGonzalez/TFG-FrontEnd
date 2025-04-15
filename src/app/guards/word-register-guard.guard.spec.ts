import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { wordRegisterGuardGuard } from '../word-register-guard.guard';

describe('wordRegisterGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => wordRegisterGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
