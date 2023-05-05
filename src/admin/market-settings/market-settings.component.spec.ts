import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketSettingsComponent } from './market-settings.component';


describe('MarketSettingsComponent', () => {
  let component: MarketSettingsComponent;
  let fixture: ComponentFixture<MarketSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
