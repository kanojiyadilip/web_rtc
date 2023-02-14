import { Injectable } from '@angular/core';
import { ErrorDialogService } from '../error-dialog/errordialog.service';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';;

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(public errorDialogService: ErrorDialogService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');
        
        if (token) {
            request = request.clone({ headers: request.headers.set('x-access-token', token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        //console.log('request--->>>', request)
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    //console.log('token--1->>>', token);
                    
                    //this.errorDialogService.openDialog(event);
                    if(event.status == 405 || event.status == 500){
                        console.log('event--2->>>', event.body);
                        this.errorDialogService.openDialog(event.body.responseMsg);
                        //localStorage.removeItem('adminId');
                        //localStorage.removeItem('token');
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                //let data = {};
                //console.log("data=================>", data);
                //data = {
                    //reason: error && error.error.reason ? error.error.reason : 'Authentication Failed',
                    //status: error.status
                //};
                //console.log("data=================>", data);
                let data = error && error.error.reason ? error.error.reason : 'Authentication Failed'
                this.errorDialogService.openDialog(data);
                return throwError(error);
            }));
    }
}