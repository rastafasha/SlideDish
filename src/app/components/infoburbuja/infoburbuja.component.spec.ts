import {  ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoburbujaComponent } from './infoburbuja.component';

describe('InfoburbujaComponent', () => {
    let component: InfoburbujaComponent;
    let fixture: ComponentFixture<InfoburbujaComponent>;

    beforeEach((() => {
        TestBed.configureTestingModule({
            declarations: [ InfoburbujaComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoburbujaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});