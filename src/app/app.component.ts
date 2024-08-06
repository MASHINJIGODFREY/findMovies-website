import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NavigationService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _destroyed$: Subject<boolean> = new Subject();
  public loadingProgressBar: boolean = false;

  constructor(private navigation: NavigationService, private router: Router){}

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this._destroyed$)).subscribe(event => {
      switch(true){
        case event instanceof NavigationStart:
          this.showProgressBar();
          break;

        case event instanceof NavigationCancel:
          this.hideProgressBar();
          break;

        case event instanceof NavigationEnd:
          this.navigation.setReturnURL(this.router.url);
          this.hideProgressBar();
          break;

        case event instanceof NavigationError:
          this.hideProgressBar();
          break;

        default:
          this.hideProgressBar();
          break;
      }
    });
  }

  private showProgressBar(): void{
    this.loadingProgressBar = true;
  }

  private hideProgressBar(): void{
    this.loadingProgressBar = false;
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
