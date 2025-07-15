import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaAdicionalComponent } from './bandeja-adicional.component';

describe('BandejaAdicionalComponent', () => {
  let component: BandejaAdicionalComponent;
  let fixture: ComponentFixture<BandejaAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandejaAdicionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandejaAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
