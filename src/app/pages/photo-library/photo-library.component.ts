
import {tap} from 'rxjs/operators';
import { Component, ViewChild, HostListener } from '@angular/core';
import { BaseClass } from '../../shared/base.class';
import { PhotoLibraryService } from './photo-library.service';
import { DiscardModalService } from '../../shared/discard-modal.service';
import { StorageService } from '../../shared/storage.service';
import { isNullOrUndefined } from 'util';
import { IPhoto } from '../../models/photo.model';
import { ActivatedRoute } from '@angular/router';
import { UserDetailsService } from '../user-details/user-details.service';
import { IUserDetails } from '../../models/user-details.model';
import { FormControl } from '@angular/forms';
import * as adssMetadata from '../../shared/adss.metadata';
import * as _ from "underscore";
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
    selector: 'photo-library',
    templateUrl: './photo-library.component.html',
    providers: [DiscardModalService]
})

export class PhotoLibraryComponent extends BaseClass {
    photoInput = new FormControl();
    photoLibrary: IPhoto[];
    logoLibrary: IPhoto[];
    isProspectUser: boolean;
    isPhotoDataReady: boolean;
    isLogoDataReady: boolean;
    errorMessage: string;
    showErrorMessage: boolean;
    customerNumber: string;
    photosCount: number;
    logosCount: number;
    userDetails: IUserDetails;
    uploadErrors: string[] = [];
    allowedExtentions: string[] = ['jpg', 'jpeg', 'png'];
    selectedPhotos: string[] = [];
    disableUpload: boolean = false;
    selectAllPhotos: boolean = false;
    selectAllLogos: boolean = false;
    dragAreaClass: string = 'dragarea';

    enterTarget = null;

    constructor(private photoLibraryService: PhotoLibraryService,
        private discardModalService: DiscardModalService,
        private storageService: StorageService,
        private route: ActivatedRoute,
        private userDetailsService: UserDetailsService,_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
        this.isPhotoDataReady = false;
        this.isLogoDataReady = false;
        this.errorMessage = "";
        this.showErrorMessage = false;
        this.isProspectUser = false;
        this.photosCount = 0;
        this.logosCount = 0;
        this.photoLibrary = [];
        (<any>window)._trackPage('ADSS - PhotoLibrary', this.route.snapshot.url);
    }

    validationInit() {
        if (this.storageService.getUserInfo().customerNumber == null) {
            this.isProspectUser = true;
        }
        else {
            this.isProspectUser = false;
            this.customerNumber = this.storageService.getUserInfo().customerNumber;
            this.getPhotoLibrary();
            this.getLogoLibrary();
        }
    }

    isMaxLimitReached() {
        if (this.photosCount >= adssMetadata.MaximumPhotosAllowed) {
            this.photoInput.disable();
            return true;
        }
        return false;
    }

    getPhotoLibrary() {
        this.photoLibraryService.getPhotoLibrary()
            .subscribe((data) => {
                this.photoLibrary = data;
                this.photoInput.enable();
                this.disableUpload = false;
                this.photosCount = this.photoLibrary.length;
                for (let i = 0; i < this.photoLibrary.length; i++) {
                    this.photoLibrary[i].Url = this.photoLibrary[i].Url + "?ts=" + this.photoLibrary[i].UpdateDate;
                }
                this.photosCount = this.photoLibrary.length;
                this.isPhotoDataReady = true;
            },
                (error) => {
                    this.photoInput.enable();
                    this.disableUpload = false;
                    this.isPhotoDataReady = true;
                })
    }

    getLogoLibrary() {
        this.photoLibraryService.getLogoLibrary()
            .subscribe((data) => {
                this.logoLibrary = data;
                this.photoInput.enable();
                this.disableUpload = false;
                this.logosCount = this.logoLibrary.length;
                this.isLogoDataReady = true;
            },
                (error) => {
                    this.photoInput.enable();
                    this.disableUpload = false;
                    this.isLogoDataReady = true;
                })
    }

    replaceImageString(url) {
        let path = '';
        let updatedUrl = path + url;
        return updatedUrl;
    }

    deleteSelected(isLogo) {
        if (isLogo) {
            this.selectedPhotos = _.map(_.where(this.logoLibrary, { "Ischecked": true }), function (o) { return o.Name; });
        }
        else {
            this.selectedPhotos = _.map(_.where(this.photoLibrary, { "Ischecked": true }), function (o) { return o.Name; });
        }
        if (this.selectedPhotos && this.selectedPhotos.length > 0) {            
            let body = "By deleting, you will lose selected image(s). Do you wish to proceed?";
            let header = "Please confirm";
            let deletePopup = this.discardModalService.deleteOrCancel(body, header);
            deletePopup.result.then(result => {
                if (result !== undefined && result.data && result.data == "continue") {
                    if (isLogo) {
                        (<any>window)._trackEvent('PhotoLibrary Delete Logo', 'Delete Logo Click', 'Delete Logo', 'Deleting Logo');
                    } else {
                        (<any>window)._trackEvent('PhotoLibrary Delete Photo', 'Delete Photo Click', 'Delete Photo', 'Deleting Photo');
                        this.photoInput.disable();
                this.disableUpload = true;
                    }
                    this.photoLibraryService.deleteMultiplePhotos(this.selectedPhotos, isLogo)
                        .subscribe((data) => {
                            if (data != undefined && data.IsSuccess) {
                                isLogo ? this.removeFromLogoArray(this.selectedPhotos) : this.removeFromPhotoArray(this.selectedPhotos);
                                this.photoInput.enable();
                                this.disableUpload = false;
                            }
                        },
                            (error) => {                                
                                this.photoInput.enable();
                                this.disableUpload = false;
                            });
                }
            });
        }
    }

    selectAllPhotosOrLogos(isLogo, $event) {       
        if (isLogo) {
            _.each(this.logoLibrary, function (e) {
                e.Ischecked = $event.checked;
            });
            this.selectAllLogos = $event.checked;           
        }
        else {
            _.each(this.photoLibrary, function (e) {
                e.Ischecked = $event.checked;
            });
            this.selectAllPhotos = $event.checked;
        }
    }

    selectPhotosOrLogos($event) {
        if ($event.isLogo) {
            this.selectAllLogos = _.map(_.where(this.logoLibrary, { "Ischecked": true }), function (o) { return o.Name; }).length == this.logoLibrary.length;
        }
        else {
            this.selectAllPhotos = _.map(_.where(this.photoLibrary, { "Ischecked": true }), function (o) { return o.Name; }).length == this.photoLibrary.length;
        }
    }

    deletePhoto(image) {
        this.uploadErrors = [];
        let images = [];
        images.push(image.photoName);          
        let body = "By deleting, you will lose uploaded image. Do you wish to proceed?";
        let header = "Please confirm";
        let deletePopup = this.discardModalService.deleteOrCancel(body, header);
        deletePopup.result.then(result => {
            if (result !== undefined && result.data && result.data == "continue") {
                if (image.isLogo == true) {
                    (<any>window)._trackEvent('PhotoLibrary Delete Logo', 'Delete Logo Click', 'Delete Logo', 'Deleting Logo');
                } else {
                    (<any>window)._trackEvent('PhotoLibrary Delete Photo', 'Delete Photo Click', 'Delete Photo', 'Deleting Photo');
                    this.photoInput.disable();
                    this.disableUpload = true;
                }               
                this.photoLibraryService.deletePhoto(image.photoName, image.isLogo)
                    .subscribe((data) => {
                        if (data != undefined ) {                            
                            image.isLogo ? this.removeFromLogoArray(images) : this.removeFromPhotoArray(images);
                            this.photoInput.enable();
                            this.disableUpload = false;
                        }
                    },
                (error) => {
                    this.photoInput.enable();
                    this.disableUpload = false;
                });
            }
        });
    }

    removeFromPhotoArray(images: string[]) {
        images.forEach(image => {
            let index = this.photoLibrary.findIndex(photo => image == photo.Name)
            this.photoLibrary.splice(index, 1);
        });
        this.photosCount = this.photoLibrary.length;
        this.isMaxLimitReached();
    }

    removeFromLogoArray(images: string[]) {
        images.forEach(image => {
            let index = this.logoLibrary.findIndex(logo => image == logo.Name)
            this.logoLibrary.splice(index, 1);
        });
        this.logosCount = this.logoLibrary.length;
    }


    fileUpload(event) {
        (<any>window)._trackEvent('PhotoLibrary Add Photo', 'Add New Photo Click', 'Add New Photo', 'Adding New Photo');
        this.saveFile(event.target.files);
    }


    saveFile(files) {
        this.uploadErrors = [];
        if (!isNullOrUndefined(files) && files.length > 0) {
            if (files.length + this.photosCount > adssMetadata.MaximumPhotosAllowed) {
                let remaining = adssMetadata.MaximumPhotosAllowed - this.photosCount;
                this.uploadErrors.push('Maximum ' + adssMetadata.MaximumPhotosAllowed + ' photos allowed in library. There is space for ' + remaining + ' more photos in this library');
            }
            else {
                for (let i = 0; i < files.length; i++) {
                    let fileName, parts, extension;
                    if (files[i] !== undefined) {
                        fileName = files[i]['name'];
                        parts = fileName.split('.');
                        extension = parts[parts.length - 1];
                    }
                    if (!this.allowedExtentions.includes(extension.toLowerCase()))
                        this.uploadErrors.push("File(s) has invalid extension, allowed extensions are - jpg, jpeg, png");
                    if (files[i].size > adssMetadata.MaximumFileSizeAllowed)
                        this.uploadErrors.push("File is too large, maximum permitted file size is: " + (adssMetadata.MaximumFileSizeAllowed / 1024) / 1024 + "MB.");
                }
                if (this.uploadErrors.length == 0) {
                    for (let i = 0; i < files.length; i++)
                        this.readThis(files[i], i, files.length);
                }
            }
        }
        this.clearPictureAttachment();
    }

    readThis(inputValue: any, index, length): void {
        this.photoInput.disable();
        this.disableUpload = true;

        var file: File = inputValue;

        let formData: FormData = new FormData();
        formData.append('myFile', file, file.name);

        this.photoLibraryService.addPhoto(formData).pipe(tap(data => {
        })).subscribe((data) => {
            if (data.IsSuccess) {
                if (index == length - 1) {
                    setTimeout(() => {
                        this.getPhotoLibrary();
                    }, 2000);
                }
            }
        },
            (error) => {
                this.photoInput.enable();
                this.disableUpload = false;
            });
    }


    @HostListener('drop', ['$event']) onDrop(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
        event.stopPropagation();
        var files = event.dataTransfer.files;
        if (!this.isProspectUser) {
            this.saveFile(files);
        }
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = "droparea";
        this.enterTarget = event.target;
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        if (this.enterTarget == event.target) {
            //console.log("dragleave ");
            this.dragAreaClass = "dragarea";
        }
        event.preventDefault();
    }

    tabChangeEvent($event) {
        if ($event.index === 0) {
            (<any>window)._trackEvent('PhotoLibrary Tab', 'Tab Click', 'Toggle', 'Photo tab active');
        }
        if ($event.index === 1) {
            (<any>window)._trackEvent('PhotoLibrary Tab', 'Tab Click', 'Toggle', 'Logo tab active');
        }
    }

    clearPictureAttachment() {
        this.photoInput.setValue('');
    }


}
