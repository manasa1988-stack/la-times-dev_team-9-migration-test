import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IMarketSettings } from '../../models/market-settings.model';
import { StorageService } from '../../shared/storage.service';
import { ICustomErrorDetails } from '../../models/custom-error.details.model';
import { ErrorDetailsService } from './error-page.service';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html'
})
export class ErrorPageComponent implements OnInit {

  code: string;
  customError: ICustomErrorDetails;
  constructor(private route: ActivatedRoute,    
    private errorDetailsService: ErrorDetailsService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.code = params['code'] ? params['code'] : null;
    });
    this.getErroDetails();
  }

  getErroDetails() {
    this.errorDetailsService.getErrorDetails(this.code).subscribe((data) => {
      this.customError = data;
    },
      (error) => {
        this.customError = <ICustomErrorDetails>{};
        this.customError.Code = "500";  
        this.customError.Message = "Sorry, there was an error processing your request";
        this.customError.Suggestions = ["Please try your request at another time or call customer support for additional information"];
      })
  }

}
