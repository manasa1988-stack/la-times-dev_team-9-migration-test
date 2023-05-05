import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmblemComponent } from './emblem.component';

describe('EmblemComponent', () => {
  let component: EmblemComponent;
  let fixture: ComponentFixture<EmblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmblemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
