import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './admin.component';
import { AdminTabHeaderComponent } from './admin-tab-header/admin-tab-header.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { OrderQueueComponent } from './order-queue/order-queue.component';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { MarketSettingsComponent } from './market-settings/market-settings.component';
import { AddNewMarketSettingsComponent } from './market-settings/add-new-market-settings/add-new-market-settings.component';
import { CacheEntriesComponent } from './cache-entries/cache-entries.component';
import { ViewCacheEntriesComponent } from './cache-entries/view-cache-entries/view-cache-entries.component';
import { RemoveCacheEntriesPopupComponent } from './cache-entries/remove-cache-entries-popup/remove-cache-entries-popup.component';
import { RegressionComponent } from './regression/regression.component';
import { AdminService } from './admin.service';
import { ThemeSettingsService } from './theme-settings/theme-settings.service';
import { AdminSettingsService } from './admin-settings/admin-settings.service';
import { MarketSettingsService } from './market-settings/market-settings.service';
import { OrderQueueService } from './order-queue/order-queue.service';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuardService } from './shared/admin-guard.service';
import { MaterialModule } from '../app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PortalComponent } from './portal/portal.component';
import { EditThemeComponent } from './theme-settings/edit-theme/edit-theme.component';
import { OrderDetailsService } from './order-details/order-details.service';
import { CacheEntriesService } from './cache-entries/cache-entries.service';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderSummaryComponent } from './order-details/order-summary/order-summary.component';
import { ErrorMessageComponent } from './error-messages/error.message.component';
import { NgStickyDirective } from './shared/ng-sticky.directive';
import { TemplateComponent } from './order-details/order-details-template/order-details-template.component';
import {AdminBroadcaster } from './shared/admin-broadcast.service';
import { AdminHeaderInterceptor } from './shared/admin-header.interceptor';
import { AdminSpinnerService } from './shared/admin-spinner.service';
import { DigitalSettingsComponent } from './digital-settings/digital-settings.component';
import { DigitalSettingsService } from './digital-settings/digital-settings.service';
import { TargetStatesComponent } from './digital-settings/target-states/target-states.component';
import { HtmlEditorComponent } from './digital-settings/html-editor/html-editor.component';
import { TargetCitiesComponent } from './digital-settings/target-states/target-cities/target-cities.component';
import { SearchPipe } from './filters/search.pipe';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  declarations: [
    AdminComponent,
    AdminTabHeaderComponent,
    AdminSettingsComponent,
    OrderQueueComponent,
    ThemeSettingsComponent,
    MarketSettingsComponent,
    AddNewMarketSettingsComponent,
    CacheEntriesComponent,
    ViewCacheEntriesComponent,
    RemoveCacheEntriesPopupComponent,    
    RegressionComponent,
    PortalComponent,
    EditThemeComponent,
    OrderDetailsComponent,
    OrderSummaryComponent,
    ErrorAlertComponent,
    ErrorMessageComponent,
    NgStickyDirective,
    TemplateComponent,
    DigitalSettingsComponent,
    TargetStatesComponent,
    HtmlEditorComponent,
    TargetCitiesComponent,
    SearchPipe
  ],
  entryComponents: [
    AddNewMarketSettingsComponent,
    EditThemeComponent,
    ViewCacheEntriesComponent,
    RemoveCacheEntriesPopupComponent,
    TemplateComponent,
    TargetCitiesComponent
  ],
  providers: [
    AdminService,
    ThemeSettingsService,
    AdminSettingsService,
    MarketSettingsService,
    OrderQueueService,
    AdminGuardService,
    OrderDetailsService,
    CacheEntriesService,
    AdminBroadcaster,
    AdminSpinnerService,
    DigitalSettingsService,
    { provide: HTTP_INTERCEPTORS, useClass: AdminHeaderInterceptor, multi: true }
    
  ],
  exports: [
    // ErrorMessageComponent
  ]
})
export class AdminModule {}