import { Component, Input, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EditAccountInformationComponent } from "../edit-account-information/edit-account-information.component";
import { ChangePasswordComponent } from "../../change-password/change-password.component";
import { BaseClass } from "../../../shared/base.class";
import { IUserDetails } from "../../../models/user-details.model";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: "account-information",
  templateUrl: "./account-information.component.html"
})
export class AccountInformationComponent extends BaseClass {
  @Input() userDetails: IUserDetails;
  @Input() isDataReady: boolean;
  @Input() isReadOnly: boolean;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {}

  private notifyEvent() {
    this.notify.emit({
      result: "reload"
    });
  }

  openAccountInfoComponent() {
    let dialogRef = this.modalService.open(EditAccountInformationComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "modal-dialog-centered"
    });
    dialogRef.componentInstance.userDetails = this.userDetails;
    dialogRef.result.then(result => {
      if (
        result != undefined &&
        result.data &&
        result.data == "reload"
      ) {        
        this.notifyEvent();
      }
    });
  }

  openChangePasswordComponent() {
    let dialogRef = this.modalService.open(ChangePasswordComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "modal-dialog-centered"
    });
  }
}
