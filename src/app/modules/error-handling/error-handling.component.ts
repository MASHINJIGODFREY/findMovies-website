import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SanitizedError } from 'src/app/factories/SanitizedError';

export const ERROR_INJECTOR_TOKEN: InjectionToken<any> = new InjectionToken('ErrorInjectionToken');

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.css']
})
export class ErrorHandlingComponent implements OnInit {
  private isVisible = new Subject<{}>();
  public dismiss$: Observable<{}> = this.isVisible.asObservable();

  constructor(@Inject(ERROR_INJECTOR_TOKEN) public error: SanitizedError) { }

  ngOnInit(): void {}

  public dismiss(): void{
    this.isVisible.next({});
    this.isVisible.complete();
  }
}
