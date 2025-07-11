import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderproductsComponent } from './sliderproducts.component';

describe('SliderproductsComponent', () => {
  let component: SliderproductsComponent;
  let fixture: ComponentFixture<SliderproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderproductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
