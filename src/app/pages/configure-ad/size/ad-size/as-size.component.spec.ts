import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSizeComponent } from './ad-size.component';

describe('AdSizeComponent', () => {
  let component: AdSizeComponent;
  let fixture: ComponentFixture<AdSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
