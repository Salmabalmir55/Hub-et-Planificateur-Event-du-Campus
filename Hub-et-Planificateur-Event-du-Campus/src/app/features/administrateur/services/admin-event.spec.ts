import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminEventService } from './admin-event';

describe('AdminEventService', () => {
  let service: AdminEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AdminEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
