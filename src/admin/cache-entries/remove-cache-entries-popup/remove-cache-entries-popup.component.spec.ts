import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCacheEntriesPopupComponent } from './remove-cache-entries-popup.component';

describe('RemoveCacheEntriesPopupComponent', () => {
  let component: RemoveCacheEntriesPopupComponent;
  let fixture: ComponentFixture<RemoveCacheEntriesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCacheEntriesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCacheEntriesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
