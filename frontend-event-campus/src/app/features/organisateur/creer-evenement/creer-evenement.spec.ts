import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerEvenement } from './creer-evenement';

describe('CreerEvenement', () => {
  let component: CreerEvenement;
  let fixture: ComponentFixture<CreerEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(CreerEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
