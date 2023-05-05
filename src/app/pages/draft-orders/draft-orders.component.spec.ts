import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftOrdersComponent } from './draft-orders.component';

describe('DraftOrdersComponent', () => {
  let component: DraftOrdersComponent;
  let fixture: ComponentFixture<DraftOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
