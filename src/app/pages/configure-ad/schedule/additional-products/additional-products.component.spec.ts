import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalProductsComponent } from './additional-products.component';

describe('AdditionalProductsComponent', () => {
  let component: AdditionalProductsComponent;
  let fixture: ComponentFixture<AdditionalProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
