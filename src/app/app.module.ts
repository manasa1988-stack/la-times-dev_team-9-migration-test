import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientJsonpModule } from '@angular/common/http';
import { NgxEditorModule } from 'ngx-editor';
// import { QuillEditorModule } from 'ngx-quill-editor';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routes';
import { AuthGuardService } from './shared/auth-guard.service';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreditCardNumberPipe } from './filters/creditcard-number.pipe';
import { DateFormatPipe } from './filters/dateformat.pipe';

import { OrderListComponent } from './pages/order-list/order-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PhotoLibraryComponent } from './pages/photo-library/photo-library.component';
import { AccountInformationComponent } from './pages/user-account/account-information/account-information.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { CreditCardsListComponent } from './pages/credit-card/credit-cards-list/credit-cards-list.component';
import { EditAccountInformationComponent } from './pages/user-account/edit-account-information/edit-account-information.component';
import { CustomerSupportComponent } from './pages/customer-support/customer-support.component';
import { AddEditCreditCardComponent } from './pages/credit-card/add-edit-credit-card/add-edit-credit-card.component';
import { RegisterService } from './pages/register/register.service';

import { UserDetailsService } from './pages/user-details/user-details.service';
import { CustomerSupportService } from './pages/customer-support/customer-support.service';
import { HeaderInterceptor } from './shared/header.interceptor';
import { CreditCardService } from './pages/credit-card/credit-card.service';
import { DraftOrdersComponent } from './pages/draft-orders/draft-orders.component';
import { FilterComponent } from './pages/order-list/filter/filter.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { DiscardChangesPopupComponent } from './pages/discard-changes-popup/discard-changes-popup.component';
import { StorageService } from "./shared/storage.service";
import { MasterDataService } from './pages/master/master.data.service';
import { CookieService } from './shared/cookies.service';

import { PhotoLibraryService } from './pages/photo-library/photo-library.service';
import { ImageFrameComponent } from './pages/image-frame/image-frame.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { DraftOrdersService } from './pages/draft-orders/draft-orders.service';
import { ErrorMessageComponent } from './pages/error-messages/error.message.component';
import { Broadcaster } from './shared/broadcast.service';
import { UserAccountService } from './pages/user-account/useraccount.service';
import { ImagePopoverComponent } from './pages/image-frame/image-popover/image-popover.component';
import { OrderHistoryService } from './pages/order-history/order-history.service';
import { NgStickyDirective } from './shared/ng-sticky.directive';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UrlSerializer } from '@angular/router';
import { LowerCaseUrlSerializer } from './app.lowerCaseUrlSerializer';
import { ErrorAlertComponent } from './pages/error-alert/error-alert.component';
import { OrderHeaderComponent } from './pages/order-list/order-header/order-header.component';
import { SpinnerService } from './shared/spinner.service';
import { ConfigureAdComponent } from './pages/configure-ad/configure-ad.component';
import { ScheduleComponent } from './pages/configure-ad/schedule/schedule.component';
import { OrderByPipe } from './filters/orderby.pipe';
import { SizeComponent } from './pages/configure-ad/size/size.component';
import { CarouselComponent } from './pages/configure-ad/size/carousel/carousel.component';
import { NumberArrayPipe } from './filters/to-number-array.pipe';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { NgxCarouselModule } from 'ngx-carousel';
import { NguCarouselModule } from '@ngu/carousel';

import { LayoutService } from './pages/configure-ad/size/layout.service';
import 'hammerjs';
import { ConfigureAdService } from './pages/configure-ad/configure-ad.service';
import { ImpressionsComponent } from './pages/configure-ad/schedule/impressions/impressions.component';
import { ReachComponent } from './pages/configure-ad/schedule/reach/reach.component';
import { ProgressSummaryComponent } from './pages/configure-ad/progress-summary/progress-summary.component';
import { ProductToggleComponent } from './pages/configure-ad/product-toggle/product-toggle.component';
import { ProductSummaryComponent } from './pages/product-summary/product-summary.component';
import { VideoPlayerComponent } from './pages/design-video/video-player.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { InventoryCheckComponent } from './pages/configure-ad/schedule/inventory-check/inventory-check.component';
import { TargetingComponent } from './pages/configure-ad/schedule/targeting/targeting.component';
import { GeoTargettingComponent } from './pages/configure-ad/schedule/geo-targetting/geo-targetting.component';
import { DigitalProductsComponent } from './pages/configure-ad/schedule/digital-products/digital-products.component';
import { ImageEditorComponent } from './pages/configure-ad/size/image-editor/image-editor.component';
import { PreviewImageComponent } from './pages/configure-ad/size/preview-image/preview-image.component';
import { GuidelinesComponent } from './pages/configure-ad/size/guidelines/guidelines.component';
// import { DesignAdComponent } from './pages/design-ad/design-ad.component';
import { EmblemComponent } from './pages/design-ad/emblem/emblem.component';
import { OtherInfoComponent } from './pages/configure-ad/other-info/other-info.component';
import { DesignAService } from './pages/design-ad/design-ad.service';
import { ReviewOrderComponent } from './pages/review-order/review-order.component';
import { OtherInfoService } from './pages/configure-ad/other-info/other-info.service';

import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { ReviewAccountInformationComponent } from './pages/review-order/review-account-information/review-account-information.component';
import { PaymentOptionsComponent } from './pages/review-order/payment-options/payment-options.component';
import { DiscardModalService } from './shared/discard-modal.service';
import { ReviewOrderService } from './pages/review-order/review-order.service';
import { PurchaseOrderService } from './pages/review-order/purchase-order.service';
import { OrderDetailsService } from './pages/order-details/order-details.service';
import { EditOrderComponent } from './pages/edit-order/edit-order.component';
import { EditMaterialComponent } from './pages/edit-order/edit-material/edit-material.component';
import { EditTextComponent } from './pages/edit-order/edit-text/edit-text.component';
import { EditUpsellComponent } from './pages/edit-order/edit-upsell/edit-upsell.component';
import { CreateOrderComponent } from './pages/create-order/create-order.component';
import { CreateOrderService } from './pages/create-order/create-order.service';
import { EditOrderService } from './pages/edit-order/edit-order.service';
import { UploadDocComponent } from './pages/upload-doc/upload-doc.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { UploadDocService } from './pages/upload-doc/upload-doc.service';
import { ConfirmationService } from './pages/order-confirmation/order-confirmation.service';
import { FormattingGuidelinesComponent } from './pages/design-ad/formatting-guidelines/formatting-guidelines.component';
import { EditUploadDocExternalComponent } from './pages/edit-upload-doc-external/edit-upload-doc-external.component';
import { ErrorDetailsService } from './pages/error-page/error-page.service';
import { EditUploadDocExternalService } from './pages/edit-upload-doc-external/edit-upload-doc-external.service';
import { ProductSummaryService } from './pages/product-summary/product-summary.service';
import { AdSizeComponent } from './pages/configure-ad/size/ad-size/ad-size.component';
import { EditMaterialViewComponent } from './pages/edit-material-view/edit-material-view.component';
import { PageNotFoundResolver } from './pages/page-not-found/page-not-found.resolver';
import { OrderInvoiceNoteComponent } from './pages/product-summary/order-invoice-note/order-invoice-note.component';
import { ComposeVideoComponent } from './pages/configure-ad/compose-video/compose-video.component';
import { WibbitzService } from './shared/services';
import { SourcePipe } from './filters/source.pipe';
import { MessageModalComponent } from './pages/design-video/message-modal/message-modal.component';
import { DesignVideoModule } from './pages/design-video/design-video.module';
import { VideoShareModalComponent } from './pages/design-video/video-share-modal.componet';
import { VideoGalleryModule } from './pages/video-gallery/video-gallery.module';
import { Title } from '@angular/platform-browser';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AdditionalProductsComponent } from './pages/configure-ad/schedule/additional-products/additional-products.component';
import { initConfig, RuntimeConfigLoaderModule, RuntimeConfigLoaderService } from 'runtime-config-loader';
import { DesignAdComponent } from './pages/design-ad/design-ad.component';
import { MessageModalModule } from './pages/design-video/message-modal/message-modal.module';


@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        OrderListComponent,
        DashboardComponent,
        PhotoLibraryComponent,
        AccountInformationComponent,
        AddEditCreditCardComponent,
        ChangePasswordComponent,
        CreditCardsListComponent,
        EditAccountInformationComponent,
        CustomerSupportComponent,
        AddEditCreditCardComponent,
        CreditCardNumberPipe,
        DraftOrdersComponent,
        FilterComponent,
        OrderHistoryComponent,
        DiscardChangesPopupComponent,
        ImageFrameComponent,
        ImagePopoverComponent,
        NgStickyDirective,
        PageNotFoundComponent,
        ErrorAlertComponent,
        OrderHeaderComponent,
        ConfigureAdComponent,
        ScheduleComponent,
        OrderByPipe,
        SizeComponent,
        CarouselComponent,
        NumberArrayPipe,
        ImageEditorComponent,
        ImpressionsComponent,
        ReachComponent,
        ProgressSummaryComponent,
        ProductToggleComponent,
        ProductSummaryComponent,
        VideoPlayerComponent,
        OrderDetailsComponent,
        InventoryCheckComponent,
        TargetingComponent,
        GeoTargettingComponent,
        DigitalProductsComponent,
        PreviewImageComponent,
        GuidelinesComponent,
        DesignAdComponent,
        EmblemComponent,
        DateFormatPipe,
        OtherInfoComponent,
        OrderConfirmationComponent,
        ReviewOrderComponent,
        ReviewAccountInformationComponent,
        PaymentOptionsComponent,
        EditOrderComponent,
        EditMaterialComponent,
        EditTextComponent,
        EditUpsellComponent,
        ErrorMessageComponent,
        CreateOrderComponent,
        UploadDocComponent,
        ErrorPageComponent,
        FormattingGuidelinesComponent,
        EditUploadDocExternalComponent,
        AdSizeComponent,
        EditMaterialViewComponent,
        OrderInvoiceNoteComponent,
        ComposeVideoComponent,
        AdditionalProductsComponent,
        MessageModalComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        RuntimeConfigLoaderModule.forRoot({fileUrl: 'wwwroot/assets/data/app-config.json'}) ,
        NgbModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ReactiveFormsModule,
        FormsModule,
        NgxCarouselModule,
        NguCarouselModule,
        AngularCropperjsModule,
        NgxEditorModule,
    //    QuillEditorModule,
        MaterialModule,
        DesignVideoModule,
        VideoGalleryModule,
        SlickCarouselModule,
        MessageModalModule,
    ],
    entryComponents: [
        RegisterComponent,
        EditAccountInformationComponent,
        AddEditCreditCardComponent,
        ChangePasswordComponent,
        FilterComponent,
        DiscardChangesPopupComponent,
        ImagePopoverComponent,
        ImageEditorComponent,
        PreviewImageComponent,
        GuidelinesComponent,
        EmblemComponent,
        FormattingGuidelinesComponent,
        OrderInvoiceNoteComponent,
        VideoPlayerComponent,
        VideoShareModalComponent,
    ],
    providers: [
              
        {
              provide: APP_INITIALIZER,
              useFactory: initConfig,
              deps: [RuntimeConfigLoaderService],
              multi: true
            },
        AuthGuardService,
        CookieService,
        RegisterService,
        UserDetailsService,
        CustomerSupportService,
        UserAccountService,
        CreditCardService,
        StorageService,
        MasterDataService,
        PhotoLibraryService,
        DraftOrdersService,
        CreditCardNumberPipe,
        Broadcaster,
        NgbActiveModal,
        OrderHistoryService,
        OrderByPipe,
        SpinnerService,
        LayoutService,
        ConfigureAdService,
        DateFormatPipe,
        DesignAService,
        OtherInfoService,
        DiscardModalService,
        ReviewOrderService,
        PurchaseOrderService,
        OrderDetailsService,
        CreateOrderService,
        EditOrderService,
        UploadDocService,
        ConfirmationService,
        ErrorDetailsService,
        EditUploadDocExternalService,
        ProductSummaryService,
        PageNotFoundResolver,
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
        { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
       
        WibbitzService,
        Title,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
