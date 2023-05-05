
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, tap} from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AdminBroadcaster } from './admin-broadcast.service';

import * as events from './admin-adss.events';

@Injectable()
export class AdminHeaderInterceptor implements HttpInterceptor {

    constructor(private broadcaster: AdminBroadcaster) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request;

            request = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                body: JSON.stringify(req.body)
            });

        let isPostReq = (request.method === "POST" || request.method === "PUT" || request.method === "DELETE");

        if (isPostReq) {
            this.broadcaster.broadcast(events.SUBMITTING, true);
        }

        else
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
                if (err.status === 400) {
                    console.log("bad request");
                }
                else {
                    return observableThrowError(err);
                }
            }
            return observableThrowError(err);
        }),);
    }
}
