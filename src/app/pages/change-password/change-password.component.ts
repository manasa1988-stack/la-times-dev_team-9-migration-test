import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscardChangesPopupComponent } from '../discard-changes-popup/discard-changes-popup.component';
import { BaseClass } from '../../shared/base.class';
import { PasswordValidator, MatchPassword } from '../../shared/custom-validators';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { UserAccountService } from '../user-account/useraccount.service';
import { ServerResponse } from '../../models/server.response.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    providers: [DiscardModalService]
})
export class ChangePasswordComponent extends BaseClass implements OnInit {

    changePasswordForm: FormGroup;
    showOldPassword: boolean;
    showNewPassword: boolean;
    showConfirmPassword: boolean;
    isSubmitted: boolean;
    serverResponse: ServerResponse;
    isFormDisabled: boolean;
    

    constructor(
        private formBuilder: FormBuilder,
        private activeModal: NgbActiveModal,
        private ngbModal: NgbModal,
        private userAccountService: UserAccountService,
         _configSvc: RuntimeConfigLoaderService,
        private discardModalService: DiscardModalService) {
        super(_configSvc);
        this.showOldPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.isSubmitted = false;
        this.isFormDisabled = false;
    }

    validationInit() {
        this.createForm();
    }

    createForm() {
        this.changePasswordForm = this.formBuilder.group({
            "OldPassword": ['', Validators.required],
            "NewPassword": ['', Validators.compose([Validators.required, PasswordValidator])],
            "ConfirmPassword": ['', Validators.compose([Validators.required])]
        }, {
                validator: MatchPassword
            })
    }

    savePassword() {
        this.isSubmitted = true;
        this.serverResponse = <ServerResponse>{};
        if (this.changePasswordForm.valid) {
            this.isFormDisabled = true;
            this.userAccountService.changePassword(this.changePasswordForm.value)
                .subscribe((data:any) => {
                    if(data.IsSuccess)
                        this.activeModal.close();                    
                    else{                        
                        this.serverResponse = data;
                        let field = this.serverResponse.ErrorMessage[0];
                        this.changePasswordForm.controls[field.Key].setErrors({
                          "serverError": field.Value
                        });
                        this.isFormDisabled = false;
                    }
                                       
                },
                    (error) => {
                        this.isFormDisabled = false;
                    })
        }
    }

    onClose() {
        this.discardModalService.continueOrCancel(this.changePasswordForm);
    }

}
