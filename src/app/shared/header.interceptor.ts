
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, tap} from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Broadcaster } from './broadcast.service';

import * as events from './adss.events';
import { isNullOrUndefined } from 'util';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

    constructor(private broadcaster: Broadcaster) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request;

        if (req.method === "POST" && req.url.indexOf("PhotoLibrary") > 0 || req.url.indexOf("UploadImage") > 0 || req.url.indexOf("UploadImageListAttribute") > 0 || req.url.indexOf("UploadAdTemplateImage") || req.url.indexOf("UploadAdTemplateImage")> 0 || req.url.indexOf("uploadLegalDocfile") > 0)
            request = req.clone({
                withCredentials: true
            });

        else
            request = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                body: JSON.stringify(req.body)
            });

        let isPostReq = (request.method === "POST" && (request.url.indexOf("rotateImage") < 0 && request.url.indexOf("ignoreProgressBar") < 0 && request.url.indexOf("getOrderItemPrice") < 0 && request.url.indexOf("updateOrderState") < 0)) || request.method === "PUT" || request.method === "DELETE" || request.url.indexOf("createNewDfpOrderItem") > 0;

        if (isPostReq) {
            this.broadcaster.broadcast(events.SUBMITTING, true);
        }
        else if(request.url.indexOf("ignoreProgressBar") < 0 && request.url.indexOf("getOrderItemPrice") < 0 && request.url.indexOf("updateOrderState") < 0)
            this.broadcaster.broadcast(events.SPINNER_STOP, false);

        return next.handle(request).pipe(tap((ev: HttpEvent<any>) => {
            if (ev instanceof HttpResponse) {
                this.broadcaster.broadcast(events.SUBMITTING, false);
                this.broadcaster.broadcast(events.SPINNER_STOP, true);
            }
        }),catchError(err => {
            if (err instanceof HttpErrorResponse) {
                this.broadcaster.broadcast(events.SUBMITTING, false);
                this.broadcaster.broadcast(events.SPINNER_STOP, true);               
                let obj = <Object>err;                
                if(!isNullOrUndefined(obj) && !isNullOrUndefined(obj['error']) && !isNullOrUndefined(obj['error'].Code))
                {
                    this.broadcaster.broadcast(events.REDIRECT_TO_ERROR, err);  
                }
                         
            }
            return observableThrowError(err);
        }),);
    }
}
