import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaSliderComponent } from './bandeja-slider.component';

describe('BandejaSliderComponent', () => {
  let component: BandejaSliderComponent;
  let fixture: ComponentFixture<BandejaSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandejaSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandejaSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
