import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalProductsComponent } from './digital-products.component';

describe('DigitalProductsComponent', () => {
  let component: DigitalProductsComponent;
  let fixture: ComponentFixture<DigitalProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
