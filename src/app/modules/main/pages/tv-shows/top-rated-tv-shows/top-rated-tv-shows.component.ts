import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { finalize, Subject, takeUntil } from 'rxjs';
import { fadeIn } from 'src/app/animations';
import { OpenDialogComponent } from 'src/app/factories/dialog-opener';
import { ScrollGovernor } from 'src/app/factories/scroll-governor';
import { Series, TVShows } from 'src/app/models';
import { ImgService, SeriesService, UiService } from 'src/app/services';
import { SeriesDetailsComponent } from '../../../components';

@Component({
  animations: [fadeIn],
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './top-rated-tv-shows.component.html',
  styleUrls: ['./top-rated-tv-shows.component.css']
})
export class TopRatedTvShowsComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public tvshows: TVShows = new TVShows();

  constructor(public  image: ImgService, private tv: SeriesService, private dialog: MatDialog, private snackBar: MatSnackBar, private ui: UiService) { }

  ngOnInit(): void {
    this.getPopularTVShows();
  }

  public getPopularTVShows(page: string = "1"): void{
    this.ui.showSpinner();
    this.tv.top_rated(page)
    .pipe(takeUntil(this._destroyed$), finalize(() => this.ui.stopSpinner()))
    .subscribe({
      next: (tvshows: TVShows) => {
        this.tvshows = tvshows;
        ScrollGovernor.scrollToTop();
      }
    });
  }

  public openTVShowDetails(item: Series): void{
    OpenDialogComponent.execute(this.dialog, SeriesDetailsComponent, item);
  }

  public goToPreviousPage(): void{
    let prevPage = this.tvshows.page - 1;
    if(prevPage == 0) return;
    this.getPopularTVShows(`${prevPage}`);
  }

  public goToNextPage(): void{
    let nextPage = this.tvshows.page + 1;
    if(nextPage > this.tvshows.total_pages) return;
    this.getPopularTVShows(`${nextPage}`);
  }

  public foundTVShows(): boolean{
    return (typeof this.tvshows.results !== "undefined" && this.tvshows.results.length > 0);
  }

  public trackByFn(index: number, item: Series): string{
    return `${item.id}`;
  }

  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
