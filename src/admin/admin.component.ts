import { Component, OnInit } from '@angular/core';
import { AdminBroadcaster } from './shared/admin-broadcast.service';
import { AdminSpinnerService } from './shared/admin-spinner.service';
import * as events from './shared/admin-adss.events';
import { AdminBaseClass } from './shared/admin-base.class';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
@Component({
  selector: 'admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent extends AdminBaseClass {

  submitting: boolean = false;

  constructor(private broadcaster: AdminBroadcaster,
    private spinnerService: AdminSpinnerService, _configSvc: RuntimeConfigLoaderService) {
    super(_configSvc);
    this.registerBroadcastEvents();

  }

  validationInit() {

  }

  registerBroadcastEvents() {
    this.broadcaster.on<boolean>(events.SUBMITTING)
      .subscribe(value => {
        this.submitting = value;
      });

    this.broadcaster.on<boolean>(events.SPINNER_STOP)
      .subscribe(value => {
        this.spinnerService.set(value);
      });
  }
}