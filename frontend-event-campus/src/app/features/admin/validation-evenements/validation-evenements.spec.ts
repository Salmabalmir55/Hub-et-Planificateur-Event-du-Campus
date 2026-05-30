import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationEvenements } from './validation-evenements';

describe('ValidationEvenements', () => {
  let component: ValidationEvenements;
  let fixture: ComponentFixture<ValidationEvenements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationEvenements],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationEvenements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
