import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardChangesPopupComponent } from './discard-changes-popup.component';

describe('DiscardChangesPopupComponent', () => {
  let component: DiscardChangesPopupComponent;
  let fixture: ComponentFixture<DiscardChangesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscardChangesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardChangesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
