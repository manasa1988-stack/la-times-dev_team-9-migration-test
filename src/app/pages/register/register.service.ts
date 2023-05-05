
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import {Observable} from "rxjs";
import {BaseService} from '../../shared/base.service';










@Injectable()
export class RegisterService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  checkUserName(ssorSignOnServer, username, callback = 'callback') {

    var url = ssorSignOnServer + '/registration/trbsecurity/suggestedusernames/jsonp?&product_code=adss&master_id=gAtVwDLOydoIUNMji77wcA&user_name=' + username;
    return this.http.jsonp(`${url}`, callback).pipe(
      map(response => response),
      catchError(this.handleError),);
  }

  registerUser(registerForm) {
    return this.http.post('/api/account/register', registerForm.value).pipe(
      map(response => response), 
      catchError(this.handleError),);
  }

}