import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendeesComponent } from './attendees';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AttendeesComponent', () => {
  let component: AttendeesComponent;
  let fixture: ComponentFixture<AttendeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading true initially', () => {
    expect(component.isLoading).toBeTrue();
  });

  it('should extract eventId from route params', () => {
    expect(component.evenementId).toBe(1);
  });
});
