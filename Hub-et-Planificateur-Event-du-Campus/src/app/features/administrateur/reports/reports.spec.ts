import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading set to true initially', () => {
    expect(component.isLoading).toBeTrue();
  });

  it('should have stats as null initially', () => {
    expect(component.stats).toBeNull();
  });

  it('should load stats on init', () => {
    spyOn(component, 'loadStats');
    component.ngOnInit();
    expect(component.loadStats).toHaveBeenCalled();
  });
});
