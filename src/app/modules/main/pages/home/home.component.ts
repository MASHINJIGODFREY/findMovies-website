import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, finalize, Subject, take, takeUntil } from 'rxjs';
import { fadeIn } from 'src/app/animations';
import { OpenDialogComponent } from 'src/app/factories/dialog-opener';
import { Movie, Movies, Series, TVShows } from 'src/app/models';
import { ImgService, MovieService, SeriesService, UiService } from 'src/app/services';
import { MovieDetailsComponent, SeriesDetailsComponent } from '../../components';

@Component({
    animations: [fadeIn],
    host: { '[@fadeInAnimation]': '' },
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public now_playing_movies: Movies = new Movies();
  public trending_movies: Movies = new Movies();
  public series: TVShows = new TVShows();

  constructor(public  image: ImgService, private ui: UiService, private movie: MovieService, private tv: SeriesService, private dialog: MatDialog, private snackBar: MatSnackBar, private renderer: Renderer2, @Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
    this.ui.showSpinner();
    combineLatest({
      now_playing_movies : this.movie.now_playing(),
      trending_movies: this.movie.trending(),
      series: this.tv.trending()
    })
    .pipe(take(1), takeUntil(this._destroyed$), finalize(() => this.ui.stopSpinner()))
    .subscribe({
      next: (response) => {
        this.now_playing_movies = response.now_playing_movies;
        this.trending_movies = response.trending_movies;
        this.series = response.series;
        this.initLightSlider();
      }
    });
  }

  private initLightSlider(): void{
    let script = this.renderer.createElement('script');
    script.type = `text/javascript`;
    script.text = `{
      $(document).ready(function(){
        $('#autoWidth,#autoWidth2').lightSlider({
          autoWidth:true,
          loop:true,
          onSliderLoad: function() {
              $('#autoWidth,#autoWidth2').removeClass('cS-hidden');
          }
        });
      });
    }`;
    this.renderer.appendChild(this.document.body, script);
  }

  public openMovieDetails(item: Movie): void{
    OpenDialogComponent.execute(this.dialog, MovieDetailsComponent, item);
  }

  public openTVShowDetails(item: Series): void{
    OpenDialogComponent.execute(this.dialog, SeriesDetailsComponent, item);
  }

  public foundMedia(media: Movies | TVShows): boolean{
    return (typeof media.results !== "undefined" && media.results.length > 0);
  }

  public trackByFn(index: number, item: Movie | Series): string{
    return `${item.id}`;
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
