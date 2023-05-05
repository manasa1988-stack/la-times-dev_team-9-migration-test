import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureAdComponent } from './configure-ad.component';

describe('ConfigureAdComponent', () => {
  let component: ConfigureAdComponent;
  let fixture: ComponentFixture<ConfigureAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
