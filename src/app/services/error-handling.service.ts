import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentRef, ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { SanitizedError } from '../factories/SanitizedError';
import { ErrorHandlingComponent, ERROR_INJECTOR_TOKEN } from '../modules/error-handling/error-handling.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService implements ErrorHandler{
  private overlay!: Overlay;

  constructor(private injector: Injector) {
    this.overlay = this.injector.get(Overlay);
  }

  handleError(error: any): void {
    const sanitizedErr = this.sanitiseError(error);
    const ngZone = this.injector.get(NgZone);
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });

    ngZone.run(() => {
      this.attachPortal(overlayRef, sanitizedErr).subscribe({
        next: () => { overlayRef.dispose(); }
      });
    });
  }

  private attachPortal(overlayRef: OverlayRef, error: any): Observable<{}>{
    const errorHandlingPortal: ComponentPortal<ErrorHandlingComponent> = new ComponentPortal(ErrorHandlingComponent, null, this.createInjector(error));
    const compRef: ComponentRef<ErrorHandlingComponent> = overlayRef.attach(errorHandlingPortal);
    return compRef.instance.dismiss$;
  }

  private createInjector(error: any): PortalInjector{
    const injectorTokens = new WeakMap<any, any>([
      [ERROR_INJECTOR_TOKEN, error]
    ]);
    return new PortalInjector(this.injector, injectorTokens);
  }

  private sanitiseError(error: Error | HttpErrorResponse): SanitizedError{
    const sanitizedError: SanitizedError = {
      title: '',
      message: error.message,
      details: []
    };
    if(error instanceof Error){
      sanitizedError.title = 'Application Error!';
      sanitizedError.details.push(`${error.stack}`);
    }else if(error instanceof HttpErrorResponse){
      sanitizedError.title = 'Connection Error!';
      sanitizedError.details = Object.keys(error).map((key: string) => `${key}: ${error}`);
    }else{
      sanitizedError.title = 'Sorry!, Something Went Wrong';
      sanitizedError.details.push(JSON.stringify(error));
    }
    return sanitizedError;
  }
}
