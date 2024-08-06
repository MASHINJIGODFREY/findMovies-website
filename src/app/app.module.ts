import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, HeadersInterceptor, HttpCancelInterceptor } from './interceptors';
import { HttpCancelService, NavigationService } from './services';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ErrorHandlingModule } from './modules/error-handling/error-handling.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    ErrorHandlingModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpCancelInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true},
    HttpCancelService,
    NavigationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
