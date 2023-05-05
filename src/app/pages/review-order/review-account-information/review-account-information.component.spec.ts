import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAccountInformationComponent } from './review-account-information.component';

describe('ReviewAccountInformationComponent', () => {
  let component: ReviewAccountInformationComponent;
  let fixture: ComponentFixture<ReviewAccountInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewAccountInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
