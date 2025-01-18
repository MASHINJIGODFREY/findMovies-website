import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ClipboardService, IClipboardResponse } from 'ngx-clipboard';
import { Subject, takeUntil } from 'rxjs';
import { fadeIn } from 'src/app/animations';

@Component({
  selector: 'app-main',
  animations: [fadeIn],
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private _destroyed$: Subject<boolean> = new Subject();
  public loadingProgressBar: boolean = false;

  constructor(private clipboardService: ClipboardService, private snackBar: MatSnackBar, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.addClass(document.querySelector('body'), 'layout-top-nav');
    this.subscribeClipboardEvents();
  }

  private subscribeClipboardEvents(): void{
    this.clipboardService.copyResponse$
    .pipe(takeUntil(this._destroyed$))
    .subscribe({
      next: (response: IClipboardResponse) => {
        if(response.isSuccess){
          this.snackBar.open("Item copied to Clipboard", "Ok", { duration: 3000 });
        }
        this.clipboardService.destroy();
      },
      error: (error: any) => {
        this.snackBar.open("Unable to copy item!!!.", "Ok", { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void{
    this.renderer.removeClass(document.querySelector('body'), 'layout-top-nav');
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
