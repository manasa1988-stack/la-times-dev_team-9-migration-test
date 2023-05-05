
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from "@angular/core";

import { ServerResponse } from '../models/server.response.model';

@Injectable()
export class BaseService {

  constructor() {
  }

  handleError(error: any) {
    console.log("error");
    console.log(error);
    return observableThrowError(error);
  }

  mapServerErrorResponse(response) {
    // console.log("mapFalseResponse", response);
    if (response instanceof Object) {
      for (let i = 0; i < response.ErrorMessage.length; i++)
        if (response.ErrorMessage.Key == 'Error' || response.ErrorMessage.Key == 'Exception') {
          response.ErrorMessage.Value = "There is an error from Server. Please try again."
        }
    }
    return response;
  }
}