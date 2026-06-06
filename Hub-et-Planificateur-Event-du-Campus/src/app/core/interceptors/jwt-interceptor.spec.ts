import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { jwtInterceptor } from './jwt-interceptor';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('jwtInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let interceptor: HttpInterceptorFn;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    interceptor = (req, next) => TestBed.runInInjectionContext(() => jwtInterceptor(req, next));
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when token exists', () => {
    authService.getToken.and.returnValue('test-token-123');

    // Pour GET, on peut utiliser new HttpRequest('GET', ...)
    const req = new HttpRequest('GET', '/api/evenements');
    let authHeaderPresent = false;
    let authHeaderValue = '';

    const next: HttpHandlerFn = (request) => {
      authHeaderPresent = request.headers.has('Authorization');
      authHeaderValue = request.headers.get('Authorization') || '';
      return of(new HttpResponse({ status: 200 }));
    };

    interceptor(req, next).subscribe();

    expect(authHeaderPresent).toBeTrue();
    expect(authHeaderValue).toBe('Bearer test-token-123');
  });

  it('should not add Authorization header for login requests', () => {
    authService.getToken.and.returnValue('test-token');

    // Pour POST, utiliser la signature avec body
    const req = new HttpRequest('POST', '/api/auth/login', {});
    let authHeaderPresent = true;

    const next: HttpHandlerFn = (request) => {
      authHeaderPresent = request.headers.has('Authorization');
      return of(new HttpResponse({ status: 200 }));
    };

    interceptor(req, next).subscribe();

    expect(authHeaderPresent).toBeFalse();
  });

  it('should not add Authorization header for register requests', () => {
    authService.getToken.and.returnValue('test-token');

    // Pour POST avec body
    const req = new HttpRequest('POST', '/api/auth/register/etudiant', {});
    let authHeaderPresent = true;

    const next: HttpHandlerFn = (request) => {
      authHeaderPresent = request.headers.has('Authorization');
      return of(new HttpResponse({ status: 200 }));
    };

    interceptor(req, next).subscribe();

    expect(authHeaderPresent).toBeFalse();
  });

  it('should not add Authorization header when token is missing', () => {
    authService.getToken.and.returnValue(null);

    const req = new HttpRequest('GET', '/api/evenements');
    let authHeaderPresent = true;

    const next: HttpHandlerFn = (request) => {
      authHeaderPresent = request.headers.has('Authorization');
      return of(new HttpResponse({ status: 200 }));
    };

    interceptor(req, next).subscribe();

    expect(authHeaderPresent).toBeFalse();
  });
});
