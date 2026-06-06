import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCatalogComponent } from './event-catalog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('EventCatalogComponent', () => {
  let component: EventCatalogComponent;
  let fixture: ComponentFixture<EventCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCatalogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty events initially', () => {
    expect(component.events).toEqual([]);
    expect(component.filteredEvents).toEqual([]);
  });

  it('should have isLoading true initially', () => {
    expect(component.isLoading).toBeTrue();
  });

  it('should filter events by search term', () => {
    component.events = [
      { id: 1, title: 'Concert de Jazz', date: '', category: '', lieu: '', price: '' },
      { id: 2, title: 'Exposition Art', date: '', category: '', lieu: '', price: '' }
    ] as any;

    component.searchTerm = 'Jazz';
    component.filterEvents();
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].title).toBe('Concert de Jazz');
  });

  it('should filter events by category', () => {
    component.events = [
      { id: 1, title: 'Event 1', category: 'Musique', date: '', lieu: '', price: '' },
      { id: 2, title: 'Event 2', category: 'Sport', date: '', lieu: '', price: '' }
    ] as any;

    component.setCategory('Musique');
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].category).toBe('Musique');
  });
});
