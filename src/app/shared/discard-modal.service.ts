import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap/modal/modal";
import { DiscardChangesPopupComponent } from "../pages/discard-changes-popup/discard-changes-popup.component";
import { NgbModalRef, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import { FormGroup } from "@angular/forms";
import { ImageEditorComponent } from "../pages/configure-ad/size/image-editor/image-editor.component";
import { PreviewImageComponent } from "../pages/configure-ad/size/preview-image/preview-image.component";

@Injectable()
export class DiscardModalService {
  defaultWarningBody: string = 'Discarding Unsaved Changes';

  constructor(private ngbModal: NgbModal, private activeModal: NgbActiveModal) {

  }

  openDiscardModal(): NgbModalRef {
    let dialogRefPopup = this.ngbModal.open(DiscardChangesPopupComponent, {
      backdrop: "static",
      size: "sm",
      windowClass: 'modal-dialog-centered'
    });

    return dialogRefPopup;
  }

  continueOrCancel(customForm: FormGroup, body: string = this.defaultWarningBody) {
    if (customForm.dirty) {
      let modalpopup = this.openDiscardModal();
      modalpopup.componentInstance.header = "Please confirm!";
      modalpopup.componentInstance.body = body;
      modalpopup.componentInstance.isError = false;
      modalpopup.result.then(result => {
        if (result !== undefined && result.data && result.data == "continue") this.closeActiveModal();
      });
    } else {
      this.closeActiveModal();
    }
  }

  deleteOrCancel(body: string, header: string) {
    let modalpopup = this.openDiscardModal();
    modalpopup.componentInstance.header = header;
    modalpopup.componentInstance.body = body;
    modalpopup.componentInstance.isError = false;
    return modalpopup;
  }

  showMessage(body: string, header: string){
    let modalpopup = this.openDiscardModal();
    modalpopup.componentInstance.header = header;
    modalpopup.componentInstance.body = body;
    modalpopup.componentInstance.isError = true;
    return modalpopup;
  }

  showAditMessage(body: string){
    let modalpopup = this.openDiscardModal();
    modalpopup.componentInstance.header = '';
    modalpopup.componentInstance.body = body;
    modalpopup.componentInstance.aditSuccessMessage = true;
    return modalpopup;
  }

  

  closeActiveModal() {
    this.activeModal.close();
  }

  showError(body: string, header: string){
    let modalpopup = this.openDiscardModal();
    modalpopup.componentInstance.header = header;
    modalpopup.componentInstance.body = body;
    modalpopup.componentInstance.isError = true;
    return modalpopup;
  }

  openImageEditorModal(): NgbModalRef {
    let dialogRefPopup = this.ngbModal.open(ImageEditorComponent, {
      backdrop: "static",
      size: "lg",
      windowClass: 'modal-dialog-centered'
    });

    return dialogRefPopup;
  }

  openImagePreviewModal(): NgbModalRef {
    let dialogRefPopup = this.ngbModal.open(PreviewImageComponent, {
      backdrop: "static",
      size: "lg",
      windowClass: 'modal-dialog-centered'
    });

    return dialogRefPopup;
  }

  confirmationModal(body: string) {
    let modalpopup = this.openDiscardModal();
    modalpopup.componentInstance.header = "Please confirm!";
    modalpopup.componentInstance.body = body;
    modalpopup.componentInstance.isError = false;
    return modalpopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {
        this.closeActiveModal();
        return true;
      }
      return false;
    });
  }
}
