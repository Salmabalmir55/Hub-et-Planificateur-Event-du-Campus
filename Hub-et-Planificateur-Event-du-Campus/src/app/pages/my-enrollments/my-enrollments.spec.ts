import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEnrollmentsComponent } from './my-enrollments';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('MyEnrollmentsComponent', () => {
  let component: MyEnrollmentsComponent;
  let fixture: ComponentFixture<MyEnrollmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEnrollmentsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty inscriptions initially', () => {
    expect(component.inscriptions).toEqual([]);
  });

  it('should have isLoading true initially', () => {
    expect(component.isLoading).toBeTrue();
  });

  it('should have activeFilter set to all by default', () => {
    expect(component.activeFilter).toBe('all');
  });

  it('should change filter when setFilter is called', () => {
    component.setFilter('upcoming');
    expect(component.activeFilter).toBe('upcoming');

    component.setFilter('past');
    expect(component.activeFilter).toBe('past');
  });
});
