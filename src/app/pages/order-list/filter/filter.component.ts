import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormArray, RequiredValidator, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import * as adssData from '../../../shared/adss.metadata';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { IFilter } from '../../../models/filter.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'orderlist-filter',
  templateUrl: './filter.component.html'
})

export class FilterComponent implements OnInit {

  filterForm: FormGroup;

  orderStatus = adssData.orderStatus;
  filterByDate = adssData.filterByDate;
  allStatus: boolean = false;
  toMinDate: NgbDateStruct;
  fromMinDate: NgbDateStruct;

  filter: IFilter = <IFilter>{};

  filterCount: number = 0;

  @Output() passFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
    this.allStatus = this.route.snapshot.url[0].path !== ('draftorders');
  }

  ngOnInit() {
    this.filterFormBuilder();
    this.filterForm.controls['from'].valueChanges.subscribe(data => {
      this.toMinDate = data
    });
    this.filterForm.controls['to'].valueChanges.subscribe(data => {
      if (data)
        this.fromMinDate = data
    });
  }

  private filterFormBuilder() {
    this.filterForm = this.formBuilder.group({
      'dateFilter': [this.filterByDate[0]],
      'from': '',
      'to': '',
      'status': this.orderStatus[0],
      'orderId': ''
    });
  }

  setFilterCounter() {

    let totalFilters = 0;
    this.filter.pageSize = 15;
    this.filter.pageNumber = 1;

    this.filter.dateFilter = this.filterForm.controls['dateFilter'].value.value;

    this.filter.orderId = !isNullOrUndefined(this.filterForm.controls['orderId'].value) && this.filterForm.controls['orderId'].value != '' ? this.filterForm.controls['orderId'].value : null;
    totalFilters += !isNullOrUndefined(this.filter.orderId) ? 1 : 0;

    this.filter.from = !isNullOrUndefined(this.filterForm.controls['from'].value) && this.filterForm.controls['from'].value != '' ? this.filterForm.controls['from'].value.year + "/" + this.filterForm.controls['from'].value.month + "/" + this.filterForm.controls['from'].value.day : null;
    totalFilters += !isNullOrUndefined(this.filter.from) ? 1 : 0;

    this.filter.to = !isNullOrUndefined(this.filterForm.controls['to'].value) && this.filterForm.controls['to'].value != '' ? this.filterForm.controls['to'].value.year + "/" + this.filterForm.controls['to'].value.month + "/" + this.filterForm.controls['to'].value.day : null;
    totalFilters += !isNullOrUndefined(this.filter.to) ? 1 : 0;

    this.filter.status = (this.filterForm.controls['status'].value.value).toUpperCase() === "ALL" ? null : this.filterForm.controls['status'].value.key;
    totalFilters += !isNullOrUndefined(this.filter.status) ? 1 : 0;

    this.filterCount = totalFilters;
  }

  apply() {
    this.setFilterCounter();
    this.passFilter.emit({ filter: this.filter });
  }

  changeDateFilter(filterVal) {
    this.filterForm.controls['dateFilter'].setValue(filterVal);
  }

  changeStatusFilter(filterVal) {
    this.filterForm.controls['status'].setValue(filterVal);
  }

  clear(control) {
    control.setValue(null);
  }


}
