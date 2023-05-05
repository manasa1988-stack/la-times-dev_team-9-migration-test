import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "../app/shared/auth-guard.service";
import { RegressionComponent } from "./regression/regression.component";
import { AdminSettingsComponent } from "./admin-settings/admin-settings.component";
import { OrderQueueComponent } from "./order-queue/order-queue.component";
import { ThemeSettingsComponent } from "./theme-settings/theme-settings.component";
import { MarketSettingsComponent } from "./market-settings/market-settings.component";
import { CacheEntriesComponent } from "./cache-entries/cache-entries.component";
import { AdminGuardService } from "./shared/admin-guard.service";
import { PortalComponent } from "./portal/portal.component";
import { AdminComponent } from "./admin.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { OrderSummaryComponent } from "./order-details/order-summary/order-summary.component";
import { DigitalSettingsComponent } from "./digital-settings/digital-settings.component";

const adminRoutes: Routes = [
    {
      path: '',
      component: AdminComponent,
      //canActivate: [AdminGuardService],
      children: [
        {
          path: '',
          children: [
            {
                path: "portal",
                component: PortalComponent
              },
              {
                path: 'portal/regression',
                component: RegressionComponent
              },
              {
                path: "adminsettings",
                component: AdminSettingsComponent
              },
              {
                path: "orderdetails",
                component: OrderDetailsComponent
              },
              {
                path: "orders/adss/:id",
                component: OrderSummaryComponent
              },
              {
                path: "orders/adit/:id",
                component: OrderSummaryComponent
              },              
              {
                path: "orderqueue",
                component: OrderQueueComponent
              },
              {
                path: "themesettings",
                component: ThemeSettingsComponent
              },
              {
                path: "marketsettings",
                component: MarketSettingsComponent
              },
              {
                path: "cache",
                component: CacheEntriesComponent
              },
              {
                path: "digitalsettings",
                component: DigitalSettingsComponent
              }
          ]
        }
      ]
    }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forChild(adminRoutes)
    ],
    exports: [
      RouterModule
    ]
  })
  export class AdminRoutingModule {}