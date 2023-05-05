
import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from "@angular/core";


@Injectable()
export class AdminBaseService {

  constructor() {
  }

  handleError(error: any) {
    return observableThrowError(error.message);
  }
}