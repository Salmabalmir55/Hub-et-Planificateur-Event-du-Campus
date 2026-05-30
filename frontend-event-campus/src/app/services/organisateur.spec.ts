import { TestBed } from '@angular/core/testing';

import { Organisateur } from './organisateur';

describe('Organisateur', () => {
  let service: Organisateur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Organisateur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
