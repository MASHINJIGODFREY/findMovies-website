import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(retryWhen(errors => errors.pipe(scan((errorCount: number, error: HttpErrorResponse) => {
        if(errorCount <= 2 && [500, 503, 504].includes(error.status)){
          return errorCount + 1;
        }
        throw error;
      }, 0), delay(1000))
    ));
  }
}
