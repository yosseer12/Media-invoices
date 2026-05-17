import { TestBed } from '@angular/core/testing';

import { Divalto } from './divalto';

describe('Divalto', () => {
  let service: Divalto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Divalto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
