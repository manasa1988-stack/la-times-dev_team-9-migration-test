import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignAdComponent } from './design-ad.component';

describe('DesignAdComponent', () => {
  let component: DesignAdComponent;
  let fixture: ComponentFixture<DesignAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
