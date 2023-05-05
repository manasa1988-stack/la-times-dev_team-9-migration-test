
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientJsonpModule, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { BaseService } from '../../shared/base.service';








import { IPhoto } from '../../models/photo.model';
import { isNullOrUndefined } from 'util';
import { ServerResponse } from '../../models/server.response.model';

@Injectable()
export class PhotoLibraryService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public addPhoto(file): Observable<any> {
    let apiUrl = '/api/PhotoLibrary';
    return this.http.post(apiUrl, file).pipe(catchError(this.handleError));
  }

  public getPhotoLibrary(customerNumber?: string): Observable<IPhoto['any']> {
    let apiUrl = '/api/PhotoLibrary?ts=' + new Date().getTime();
    if (!isNullOrUndefined(customerNumber) && customerNumber.length > 0) {
      apiUrl += '&customerNumber=' + customerNumber;
    }
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }

  public getLogoLibrary(customerNumber?: string): Observable<IPhoto['any']> {
    let apiUrl = '/api/photolibrary/logos';
    if (!isNullOrUndefined(customerNumber) && customerNumber.length > 0) {
      apiUrl += '?customerNumber=' + customerNumber;
    }
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }

  public rotatePhoto(photoName: string, isLogo: boolean): Observable<any> {
    let apiUrl = '/api/photolibrary/rotateImage?fileName=' + photoName + '&isLogo=' + isLogo;
    let body = '';
    return this.http.post(apiUrl, body).pipe(
      map(response => response),
      catchError(this.handleError),);
  }

  public deletePhoto(photoName: string, isLogo: boolean): Observable<any> {
    let apiUrl = '/api/PhotoLibrary?fileName=' + photoName + '&isLogo=' + isLogo;;
    return this.http.delete(apiUrl).pipe(catchError(this.handleError));
  }

  public deleteMultiplePhotos(photoNames: string[], isLogo: boolean): Observable<ServerResponse['Result']> {
    let urlParams: URLSearchParams = new URLSearchParams();
    photoNames.forEach(n => urlParams.append('fileNames', n));
    let apiUrl = '/api/PhotoLibrary/bulk?' + urlParams;
    apiUrl += '&isLogo=' + isLogo;
    return this.http.delete(apiUrl).pipe(catchError(this.handleError));

  }


}