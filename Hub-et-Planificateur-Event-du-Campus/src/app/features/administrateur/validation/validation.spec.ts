import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationComponent } from './validation';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('ValidationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading set to true initially', () => {
    expect(component.isLoading).toBeTrue();
  });

  it('should have empty pendingEvents array initially', () => {
    expect(component.pendingEvents).toEqual([]);
  });

  it('should load pending events on init', () => {
    spyOn(component, 'loadPendingEvents');
    component.ngOnInit();
    expect(component.loadPendingEvents).toHaveBeenCalled();
  });
});
