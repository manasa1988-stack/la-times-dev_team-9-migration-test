import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewMarketSettingsComponent } from './add-new-market-settings.component';


describe('AddNewMarketSettingsComponent', () => {
  let component: AddNewMarketSettingsComponent;
  let fixture: ComponentFixture<AddNewMarketSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMarketSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMarketSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
