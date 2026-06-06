import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { OrganisateurService } from './organisateur.service';
import { environment } from '../../../../environments/environment';

describe('OrganisateurService', () => {
  let service: OrganisateurService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OrganisateurService
      ]
    });
    service = TestBed.inject(OrganisateurService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch categories', () => {
    const mockCategories = [
      { id: 1, nom: 'Conférence' },
      { id: 2, nom: 'Atelier' }
    ];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${apiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockCategories });
  });

  it('should fetch salles', () => {
    const mockSalles = [
      { id: 1, nom: 'Amphi A', capacite: 100 },
      { id: 2, nom: 'Salle B', capacite: 50 }
    ];

    service.getSalles().subscribe(salles => {
      expect(salles).toEqual(mockSalles);
    });

    const req = httpMock.expectOne(`${apiUrl}/salles`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockSalles });
  });

  it('should create an event', () => {
    const mockEvent = { id: 1, titre: 'New Event' };
    const eventData = { titre: 'New Event', dateDebut: '2024-12-25T10:00:00' };

    service.createEvent(eventData).subscribe(event => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${apiUrl}/evenements`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(eventData);
    req.flush({ success: true, data: mockEvent });
  });

  it('should update an event', () => {
    const mockEvent = { id: 1, titre: 'Updated Event' };
    const eventData = { titre: 'Updated Event' };

    service.updateEvent(1, eventData).subscribe(event => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${apiUrl}/evenements/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(eventData);
    req.flush({ success: true, data: mockEvent });
  });

  it('should fetch organisateur events', () => {
    const mockEvents = [
      { id: 1, titre: 'Event 1' },
      { id: 2, titre: 'Event 2' }
    ];

    service.getMesEvenements(1).subscribe(events => {
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${apiUrl}/evenements/organisateur/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockEvents });
  });
});
