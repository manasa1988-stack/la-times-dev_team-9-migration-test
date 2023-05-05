
import {tap} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BaseClass } from '../../shared/base.class';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { isNullOrUndefined, isNull } from 'util';
import { ActivatedRoute, Params } from '@angular/router';
import { IOrder, IOrderItem, ILegalDoc } from '../../models/order-item.model';
import { OrderHistoryService } from '../order-history/order-history.service';
import { IUploadLegalDocResponse, IUploadDocExternal } from '../../models/upload-legal-doc.response.model';
import { OtherInfoService } from '../configure-ad/other-info/other-info.service';
import { EditUploadDocExternalService } from './edit-upload-doc-external.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'edit-upload-doc-external',
  templateUrl: './edit-upload-doc-external.component.html',
  styleUrls: ['./edit-upload-doc-external.component.css'],
  providers: [DiscardModalService]
})
export class EditUploadDocExternalComponent extends BaseClass {

  orderItemId: number;  
  aditId: number;
  packageID: number; 
  uploadDocExternal: IUploadDocExternal;
  isDocumentsLoaded: boolean = false;
  fileExtension: string;
  allowedExtentions: string[] = ['jpeg', 'jpg', 'pdf', 'doc', 'docx'];
  showUploadDocErrorMessage: boolean = false;
  uploadDocErrorMessage = [];
  uploadLegalDocResponse: IUploadLegalDocResponse;
  LstLegalDocs: ILegalDoc[] = [];

  constructor(private route: ActivatedRoute,
    private editUploadDocExternalService: EditUploadDocExternalService,
    private otherInfoService: OtherInfoService,
    private discardModalService: DiscardModalService,_configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
  }

  validationInit() {
    this.route.params.subscribe((params: Params) => {
      this.aditId = params['aditId'] ? params['aditId'] : null;
    });

    this.route.queryParams.subscribe((params: Params) => {
      this.orderItemId = params['OrderItemId'] ? params['OrderItemId'] : null;
      this.packageID = params['packageID'] ? params['packageID'] : null;
    });

    this.getExternalDocDetails();
  }

  getExternalDocDetails() {
    this.editUploadDocExternalService.getUploadDocExternal(this.aditId,this.orderItemId,this.packageID)
      .subscribe(data => {
        this.uploadDocExternal = data;          
        this.isDocumentsLoaded = true;
      },
      (error) => {
        this.isDocumentsLoaded = true;
      });
  }

  isValidWindowsFileName(fileName){
    var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    var rg2=/^\./; // cannot start with dot (.)
    var rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
      return rg1.test(fileName);
  }
 /* isAlphaNumeric(str) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123) &&
          !(code === 32)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  }*/

  uploadLegalDoc($event) {
    let inputValue = $event.target.files[0];
    let fileName = inputValue['name'];
    let parts = fileName.split('.');
    this.fileExtension = parts[parts.length - 1];
    this.showUploadDocErrorMessage = false;
    this.uploadDocErrorMessage = [];

    if(this.isValidWindowsFileName(parts[0])) 
    {
    if (this.allowedExtentions.includes(this.fileExtension.toLowerCase())) {
      if (inputValue.size <= 10485760) {
        this.readFile(inputValue);
      }
      else {
        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("File is too large, maximum permitted file size is: 10MB.");
      }
    } else {

      this.showUploadDocErrorMessage = true;
      this.uploadDocErrorMessage.push("File has invalid extension, allowed extensions are: JPG,JPEG,PDF,DOC,DOCX");
    }
  }
  else{
    this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("File name cannot contain the following characters  \\ / : * ? \" < > |");
  }
  }

  readFile(inputValue: any): void {
    var file: File = inputValue;
    let formData: FormData = new FormData();
    formData.append('myFile', file, file.name);
    let legalDoc = <ILegalDoc>{};

    this.otherInfoService.uploadLegalDoc(this.uploadDocExternal.OrderId, this.orderItemId, formData).pipe(tap(data => {
    })).subscribe((data) => {
      if (data.IsSuccess) {
        this.uploadLegalDocResponse = data.Result;
        legalDoc.DocumentName = this.uploadLegalDocResponse.DocumentName;
        legalDoc.DocumentId = this.uploadLegalDocResponse.DocumentId;
        legalDoc.OrderId = this.uploadDocExternal.OrderId;
        legalDoc.OrderItemId = this.orderItemId;
        if (isNullOrUndefined(this.uploadDocExternal.LstApiUploadLegalDoc)) {
          this.uploadDocExternal.LstApiUploadLegalDoc = [];
        }
        this.uploadDocExternal.LstApiUploadLegalDoc.push(legalDoc);
        // this.uploadDocExternal.LstApiUploadLegalDoc = this.LstLegalDocs;
      }
      else {
        this.showUploadDocErrorMessage = true;
        data.ValidationMessage.forEach(validationMesg => {
          this.uploadDocErrorMessage.push(validationMesg.Value);
        });
        data.ErrorMessage.forEach(validationMesg => {
          this.uploadDocErrorMessage.push(validationMesg.Value);
        });
      }
    },
      (error) => {
        this.showUploadDocErrorMessage = true;
        this.uploadDocErrorMessage.push("There is an error from Server. Please try again.");
      });
  }

  removeLegalDoc(legalDoc: ILegalDoc) {
    this.showUploadDocErrorMessage = false;
    this.uploadDocErrorMessage = [];
    let body = "Are you sure you want to delete this document?";
    let header = "Confirmation";
    let deletePopup = this.discardModalService.deleteOrCancel(body, header);
    deletePopup.result.then(result => {
      if (result !== undefined && result.data && result.data == "continue") {      
        this.otherInfoService.deleteLegalDoc(legalDoc).pipe(tap(data => {
        })).subscribe((data) => {
          if (data.IsSuccess) {
            this.LstLegalDocs = this.uploadDocExternal.LstApiUploadLegalDoc.filter(d => d.DocumentId != legalDoc.DocumentId);
            this.uploadDocExternal.LstApiUploadLegalDoc = this.LstLegalDocs;
          }
          else {
            this.showUploadDocErrorMessage = true;
            data.ValidationMessage.forEach(validationMesg => {
              this.uploadDocErrorMessage.push(validationMesg.Value);
            });
            data.ErrorMessage.forEach(validationMesg => {
              this.uploadDocErrorMessage.push(validationMesg.Value);
            });
          }
        },
          (error) => {
            this.showUploadDocErrorMessage = true;
            this.uploadDocErrorMessage.push("There is an error from Server. Please try again.");
          });
      }
    });
  }

}
