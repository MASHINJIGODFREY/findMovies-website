import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlingComponent } from './error-handling.component';
import { FullscreenOverlayContainer, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { ErrorHandlingService } from 'src/app/services';



@NgModule({
  declarations: [
    ErrorHandlingComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule
  ],
  entryComponents: [
    ErrorHandlingComponent
  ]
})
export class ErrorHandlingModule {
  public static forRoot(): ModuleWithProviders<ErrorHandlingModule>{
    return {
      ngModule: ErrorHandlingModule,
      providers: [
        { provide: ErrorHandler, useClass: ErrorHandlingService },
        { provide: OverlayContainer, useClass: FullscreenOverlayContainer }
      ]
    }
  }
}
