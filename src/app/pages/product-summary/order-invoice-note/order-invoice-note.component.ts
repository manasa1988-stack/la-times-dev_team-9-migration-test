import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseClass } from '../../../shared/base.class';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { EditOrderService } from '../../edit-order/edit-order.service';
import {IOrderInvoiceNote } from '../../../models/edit-order.model';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'order-invoice-note',
  templateUrl: './order-invoice-note.component.html',
  styleUrls: ['./order-invoice-note.component.css']
})
export class OrderInvoiceNoteComponent extends BaseClass {
    
    @Output() sendData: EventEmitter<any> = new EventEmitter<string>();
   
    isInvoiceNoteEdited: boolean = false;
    invoiceNote = new FormControl();
    orderInvoiceNote: IOrderInvoiceNote;

    constructor(public activeModal: NgbActiveModal, private editOrderService: EditOrderService, private router: Router,_configSvc: RuntimeConfigLoaderService) {
        super(_configSvc);
    }

    validationInit() {
        this.invoiceNote.valueChanges.subscribe(value => {
            this.sendData.emit({ invoiceNote: value });
          });
          if(this.orderInvoiceNote != undefined){
            this.invoiceNote.setValue(this.orderInvoiceNote.OrderNotes);
          }
    };

    updateInvoiceNote() {
        this.editOrderService.updateOrderInvoiceNote(this.orderInvoiceNote).subscribe(result => {
            if(result.IsSuccess) {
                this.activeModal.close();
                this.router.navigateByUrl("/my-orders");
            }
        });
    }

    onChangingInvoiceNote(){
        if(this.orderInvoiceNote.OrderNotes != this.invoiceNote.value){
            this.isInvoiceNoteEdited = true;
            this.orderInvoiceNote.OrderNotes = this.invoiceNote.value;
        }
    }
}
