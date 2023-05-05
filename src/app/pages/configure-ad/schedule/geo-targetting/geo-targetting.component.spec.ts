import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoTargettingComponent } from './geo-targetting.component';

describe('GeoTargettingComponent', () => {
  let component: GeoTargettingComponent;
  let fixture: ComponentFixture<GeoTargettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoTargettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoTargettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
