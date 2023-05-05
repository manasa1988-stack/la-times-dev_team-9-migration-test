
import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from "../../shared/base.service";
import { ICreditCard } from '../../models/credit-card.model';

@Injectable()
export class CreditCardService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public addCreditCard(card: ICreditCard): Observable<any> {
    // const apiUrl = 'assets/data/credit-card.json';
    const apiUrl = '/api/user/creditcard';
    return this.http.post(apiUrl, card).pipe(catchError(this.handleError));
  }

  public editCreditCard(card: ICreditCard): Observable<any> {
    //const apiUrl = 'assets/data/credit-card.json';
    const apiUrl = '/api/user/creditcard';
    return this.http.put(apiUrl, card).pipe(catchError(this.handleError));
  }

  public deleteCreditCard(cardId: number): Observable<any> {
    //const apiUrl = 'assets/data/credit-card.json';
    const apiUrl = '/api/user/creditcard?creditCardId=' + cardId;
    return this.http.delete(apiUrl).pipe(catchError(this.handleError));
  }

  public setPrimaryCreditCard(card: ICreditCard): Observable<any> {
    //const apiUrl = 'assets/data/credit-card.json';
    const apiUrl = '/api/user/creditcard/setprimary?creditCardId=' + card.Id;
    return this.http.put(apiUrl, card).pipe(catchError(this.handleError));
  }

}