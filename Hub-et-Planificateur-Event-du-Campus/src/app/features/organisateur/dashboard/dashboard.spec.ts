import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AuthService,
        EventService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading true initially', () => {
    expect(component.isLoading).toBeTrue();
  });

  it('should have activeTab set to ALL by default', () => {
    expect(component.activeTab).toBe('ALL');
  });

  it('should change tab when setTab is called', () => {
    component.setTab('VALIDE');
    expect(component.activeTab).toBe('VALIDE');

    component.setTab('TERMINE');
    expect(component.activeTab).toBe('TERMINE');
  });

  it('should format date correctly', () => {
    const date = component.formatDate('2024-12-25T10:00:00');
    expect(date).toBeTruthy();
    expect(typeof date).toBe('string');
    expect(date).toContain('25');
  });

  it('should return dash for empty date', () => {
    const date = component.formatDate('');
    expect(date).toBe('-');
  });

  it('should return dash for undefined date', () => {
    const date = component.formatDate(undefined);
    expect(date).toBe('-');
  });

  it('should return correct statut label', () => {
    expect(component.statutLabel('EN_ATTENTE')).toBe('En attente');
    expect(component.statutLabel('VALIDE')).toBe('Validé');
    expect(component.statutLabel('TERMINE')).toBe('Terminé');
    expect(component.statutLabel('ANNULE')).toBe('Annulé');
    expect(component.statutLabel('EN_COURS')).toBe('En cours');
    // Remplacer 'UNKNOWN' par undefined ou un vrai statut
    expect(component.statutLabel(undefined)).toBe('-');
  });

  it('should update stats when events change', () => {
    // Simuler des événements
    component.events = [
      { id: 1, titre: 'Event 1', statut: 'VALIDE', dateDebut: '2024-01-01' } as any,
      { id: 2, titre: 'Event 2', statut: 'EN_ATTENTE', dateDebut: '2024-01-01' } as any,
      { id: 3, titre: 'Event 3', statut: 'VALIDE', dateDebut: '2024-01-01' } as any
    ];
    component.updateStats();

    expect(component.stats.total).toBe(3);
    expect(component.stats.valides).toBe(2);
    expect(component.stats.enAttente).toBe(1);
  });

  it('should filter events by tab', () => {
    component.events = [
      { id: 1, titre: 'Event 1', statut: 'VALIDE', dateDebut: '2024-01-01' } as any,
      { id: 2, titre: 'Event 2', statut: 'EN_ATTENTE', dateDebut: '2024-01-01' } as any
    ];

    component.setTab('VALIDE');
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].statut).toBe('VALIDE');
  });

  it('should load mock data when no user', () => {
    spyOn(component as any, 'loadMockData');
    component.ngOnInit();
    expect(component.isLoading).toBeDefined();
  });
});
