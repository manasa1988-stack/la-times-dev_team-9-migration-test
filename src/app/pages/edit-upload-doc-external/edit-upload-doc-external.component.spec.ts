import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUploadDocExternalComponent } from './edit-upload-doc-external.component';

describe('EditUploadDocExternalComponent', () => {
  let component: EditUploadDocExternalComponent;
  let fixture: ComponentFixture<EditUploadDocExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUploadDocExternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUploadDocExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
