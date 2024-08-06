import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { LoadingSpinnerComponent } from '../modules/main/components';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private _spinnerRef: OverlayRef;

  constructor(private overlay: Overlay) {
    this._spinnerRef = this.cdkSpinnerCreate();
  }

  private cdkSpinnerCreate(): OverlayRef{
    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });
  }

  public showSpinner(): void{
    this._spinnerRef = this.cdkSpinnerCreate();
    this._spinnerRef.attach(new ComponentPortal(LoadingSpinnerComponent));
  }

  public stopSpinner(): any{
    return this._spinnerRef.hasAttached() ? this._spinnerRef.detach() : null;
  }
}
