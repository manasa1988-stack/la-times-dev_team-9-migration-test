import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToggleComponent } from './product-toggle.component';

describe('ProductToggleComponent', () => {
  let component: ProductToggleComponent;
  let fixture: ComponentFixture<ProductToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
