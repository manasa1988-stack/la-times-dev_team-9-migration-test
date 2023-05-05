import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattingGuidelinesComponent } from './formatting-guidelines.component';

describe('GuidelinesComponent', () => {
  let component: FormattingGuidelinesComponent;
  let fixture: ComponentFixture<FormattingGuidelinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormattingGuidelinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattingGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
