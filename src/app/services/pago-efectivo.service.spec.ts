import { TestBed } from '@angular/core/testing';

import { PagoEfectivoService } from './pago-efectivo.service';

describe('PagoEfectivoService', () => {
  let service: PagoEfectivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagoEfectivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
