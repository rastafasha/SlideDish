import { TestBed } from '@angular/core/testing';

import { PagochequeService } from './pagocheque.service';

describe('PagochequeService', () => {
  let service: PagochequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagochequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
