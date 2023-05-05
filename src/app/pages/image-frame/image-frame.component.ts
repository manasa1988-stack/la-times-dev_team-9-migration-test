import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ImagePopoverComponent } from './image-popover/image-popover.component';
import { PhotoLibraryService } from '../photo-library/photo-library.service';
import { IPhoto } from '../../models/photo.model';
// import { environment } from "../../../environments/environment";
import { isNullOrUndefined } from 'util';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'image-frame',
  templateUrl: './image-frame.component.html'
})
export class ImageFrameComponent {

  @Input() photo: IPhoto;
  @Input() imageType: string;
  @Output() deletePhoto = new EventEmitter();
  @Output() rotatePhoto = new EventEmitter();
  @Output() selectPhotosOrLogos = new EventEmitter();
  constructor(private ngbModal: NgbModal,
    private _configSvc: RuntimeConfigLoaderService,
    private photoLibraryService: PhotoLibraryService) {
  }

  ngOnInit() {

  }

  delete() {
    let isLogo = this.imageType === "photo" ? false : true;
    this.deletePhoto.emit({ photoName: this.photo.Name, isLogo: isLogo });
  }

  SelectPhotoOrLogo(photo, $event) {    
    let isLogo = this.imageType === "photo" ? false : true;
    photo.Ischecked = $event.checked;
    this.selectPhotosOrLogos.emit({ photo: photo});
  }

  rotate() {
    (<any>window)._trackEvent('PhotoLibrary Rotate Photo', 'Rotate Photo Click', 'Rotate Photo', 'Rotating Photo');
    this.photo.showLoader = true;
    this.photoLibraryService.rotatePhoto(this.photo.Name, false)
      .subscribe((result) => {
        if (result != undefined && result == true) {
          this.photo.showLoader = false;
          this.refreshPhoto(this.photo);
        }
      })
  }

  imagePreview() {
    const modalRef = this.ngbModal.open(ImagePopoverComponent, {
      windowClass: "modal-dialog-centered photolibrary"
    });
    modalRef.componentInstance.imagePath = this.photo.Url;
    modalRef.result.then(result => {

    });
  }

  refreshPhoto(data) {
    this.photo = data;
    if (this.photo && this.photo.Url != "") {
      var num = Math.random();
      this.photo.Url = this.photo.Url + "?v=" + num;
      this.photo.UpdateDate = new Date().toLocaleDateString();
    }
  }

  download() {
    (<any>window)._trackEvent('PhotoLibrary Download Photo', 'Download Photo Click', 'Download Photo', 'Downloading Photo');
  }

  getDownloadUrl(url: string) {
    const hostLocation = window.location.host;
    //console.log(hostLocation);
    return url.replace(this._configSvc.getConfigObjectKey("assetsHost"), '//' + hostLocation + '/');
  }
}
