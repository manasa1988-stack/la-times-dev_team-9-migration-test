import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCreditCardComponent } from './add-edit-credit-card.component';

describe('AddEditCreditCardComponent', () => {
  let component: AddEditCreditCardComponent;
  let fixture: ComponentFixture<AddEditCreditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCreditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
