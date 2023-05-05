import { Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { LoginComponent } from "./pages/login/login.component";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { PhotoLibraryComponent } from "./pages/photo-library/photo-library.component";
import { DraftOrdersComponent } from "./pages/draft-orders/draft-orders.component";
import { OrderHistoryComponent } from "./pages/order-history/order-history.component";
import { AuthGuardService } from "./shared/auth-guard.service";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { ConfigureAdComponent } from "./pages/configure-ad/configure-ad.component";
import { OrderDetailsComponent } from "./pages/order-details/order-details.component";
import { DesignAdComponent } from "./pages/design-ad/design-ad.component";
import { OrderConfirmationComponent } from "./pages/order-confirmation/order-confirmation.component";
import { ReviewOrderComponent } from "./pages/review-order/review-order.component";
import { EditOrderComponent } from "./pages/edit-order/edit-order.component";
import { CreateOrderComponent } from "./pages/create-order/create-order.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { UploadDocComponent } from "./pages/upload-doc/upload-doc.component";
import { EditUploadDocExternalComponent } from "./pages/edit-upload-doc-external/edit-upload-doc-external.component";
import { EditMaterialViewComponent } from "./pages/edit-material-view/edit-material-view.component";
import { PageNotFoundResolver } from "./pages/page-not-found/page-not-found.resolver";
import { DesignVideoComponent } from './pages/design-video/design-video.component';
import { VideoGalleryComponent } from "./pages/video-gallery/video-gallery.component";
import { ManageVideoComponent } from "./pages/manage-video/manage-video.component";

export const appRoutes: Routes = [
  {
    path: 'admin',
   loadChildren: () => import('admin/admin.module').then(m => m.AdminModule)
    //canLoad: [AuthGuardService]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "drafts/:adssId/purchase",
    component: ReviewOrderComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "my-dashboard",
    redirectTo: '/dashboard'
  },
  {
    path: "photolibrary",
    component: PhotoLibraryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "draftorders",
    component: DraftOrdersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "my-orders",
    component: OrderHistoryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "orders/create",
    component: CreateOrderComponent
    //canActivate: [AuthGuardService]
  },
  {
    path: "drafts/:draftId/configure",
    component: ConfigureAdComponent
    //canActivate: [AuthGuardService]
  },
  {
    path: "drafts/:draftId/design-video",
    component: DesignVideoComponent,
    //canActivate: [AuthGuardService]
  },
  {
    path: 'videogallery',
    component: VideoGalleryComponent,
    data: {videoGalleryTitle: true},
  },
  {
    path: 'managevideo/:draftId',
    component: ManageVideoComponent
  },
  {
    path: "drafts/:draftId/:currentOrderItemId/configure",
    component: ConfigureAdComponent
    //canActivate: [AuthGuardService]
  },
  {
    path: "drafts/:draftId/:currentOrderItemId/design-ad",
    component: DesignAdComponent
    //canActivate: [AuthGuardService]
  },
  {
    path: "system/adit/:draftId/design-ad",
    component: DesignAdComponent
  },
  {
    path: "system/adss/:aditId/edituploaddocexternal",
    component: EditUploadDocExternalComponent
  },
  {
    path: "drafts/:adssId/purchase",
    component: ReviewOrderComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "purchase/:orderId/confirmation",
    component: OrderConfirmationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "order/confirmation/:orderId",
    component: OrderConfirmationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "orders/:orderId",
    canActivate: [AuthGuardService],
    component: OrderDetailsComponent
  },
  {
    path: "queued/:adssId",
    canActivate: [AuthGuardService],
    component: OrderDetailsComponent
  },
  {
    path: "order/edit/:orderId/:externalAdMaterialId",
    canActivate: [AuthGuardService],
    component: EditOrderComponent
  },
  {
    path: "orders/:orderId/material/:externalAdMaterialId",
    component: EditMaterialViewComponent
  },
  {
    path: "orders/:orderId/edit/material/:externalAdMaterialId",
    component: EditOrderComponent
  },
  {
    path: "system/:systemName/:orderId/imagelistattribute/:imageListAttributeId/:classCodeGroupId",
    component: EditOrderComponent
  },
  {
    path: "system/:systemName/:orderId/material/:externalAdMaterialId",
    component: EditMaterialViewComponent
  },
  {
    path: "errors",
    component: ErrorPageComponent
  },
  {
    path: 'system/adit/:orderId/upload-doc',
    component: UploadDocComponent
  },
  {
    path: "",
    redirectTo: '/dashboard',
    pathMatch: "full"
  },
  {
    path: "404",
    component: PageNotFoundComponent,
    resolve : {
      pnf: PageNotFoundResolver
    }
  },
  {
    path: "**",
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
