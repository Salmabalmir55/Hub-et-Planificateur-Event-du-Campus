import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
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

  it('should have empty events array initially', () => {
    expect(component.events).toEqual([]);
    expect(component.filteredEvents).toEqual([]);
  });

  it('should change tab when setTab is called', () => {
    component.setTab('EN_ATTENTE');
    expect(component.activeTab).toBe('EN_ATTENTE');

    component.setTab('VALIDE');
    expect(component.activeTab).toBe('VALIDE');
  });

  it('should filter events by tab', () => {
    component.events = [
      { id: 1, titre: 'Event 1', statut: 'EN_ATTENTE' } as any,
      { id: 2, titre: 'Event 2', statut: 'VALIDE' } as any,
      { id: 3, titre: 'Event 3', statut: 'TERMINE' } as any
    ];

    component.setTab('EN_ATTENTE');
    component.applyFilter();
    expect(component.filteredEvents.length).toBe(1);

    component.setTab('VALIDE');
    component.applyFilter();
    expect(component.filteredEvents.length).toBe(1);
  });

  it('should format date correctly', () => {
    const date = component.formatDate('2024-12-25T10:00:00');
    expect(date).toBeTruthy();
    expect(typeof date).toBe('string');
  });

  it('should return dash for empty date', () => {
    const date = component.formatDate('');
    expect(date).toBe('-');
  });
});
