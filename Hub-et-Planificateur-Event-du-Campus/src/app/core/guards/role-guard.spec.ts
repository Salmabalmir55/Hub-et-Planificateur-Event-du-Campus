import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { roleGuard } from './role-guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRole']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to login if not authenticated', () => {
    authService.isLoggedIn.and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], jasmine.any(Object));
  });

  it('should allow access if no role required and authenticated', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = executeGuard({ data: {} } as any, {} as any);

    expect(result).toBeTrue();
  });

  it('should allow access if user has required role', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole.and.returnValue('ROLE_ADMIN');

    const result = executeGuard({ data: { role: 'ADMIN' } } as any, {} as any);

    expect(result).toBeTrue();
  });

  it('should deny access if user has wrong role', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole.and.returnValue('ROLE_ETUDIANT');
    const navigateSpy = spyOn(router, 'navigate');

    const result = executeGuard({ data: { role: 'ADMIN' } } as any, {} as any);

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
