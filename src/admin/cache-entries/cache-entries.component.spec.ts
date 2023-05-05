import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheEntriesComponent } from './cache-entries.component';


describe('CacheEntriesComponent', () => {
  let component: CacheEntriesComponent;
  let fixture: ComponentFixture<CacheEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CacheEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
