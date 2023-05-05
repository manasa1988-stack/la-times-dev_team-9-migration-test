import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-popover',
  templateUrl: './image-popover.component.html'
})
export class ImagePopoverComponent implements OnInit {

  imagePath: string;
  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
