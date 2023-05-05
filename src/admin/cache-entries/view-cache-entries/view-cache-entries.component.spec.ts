import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCacheEntriesComponent } from './view-cache-entries.component';


describe('ViewCacheEntriesComponent', () => {
  let component: ViewCacheEntriesComponent;
  let fixture: ComponentFixture<ViewCacheEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCacheEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCacheEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
