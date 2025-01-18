import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { fadeIn } from 'src/app/animations';
import { OpenDialogComponent } from 'src/app/factories/dialog-opener';
import { ScrollGovernor } from 'src/app/factories/scroll-governor';
import { Movie, Movies } from 'src/app/models';
import { ImgService, MovieService, UiService } from 'src/app/services';
import { MovieDetailsComponent } from '../../../components';

@Component({
    animations: [fadeIn],
    host: { '[@fadeInAnimation]': '' },
    templateUrl: './upcoming-movies.component.html',
    styleUrls: ['./upcoming-movies.component.css'],
    standalone: false
})
export class UpcomingMoviesComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public movies: Movies = new Movies();

  constructor(public  image: ImgService, private movie: MovieService, private dialog: MatDialog, private snackBar: MatSnackBar, private ui: UiService) { }

  ngOnInit(): void {
    this.getUpcomingMovies();
  }

  public getUpcomingMovies(page: string = "1"): void{
    this.ui.showSpinner();
    this.movie.upcoming(page)
    .pipe(take(1), takeUntil(this._destroyed$), finalize(() => this.ui.stopSpinner()))
    .subscribe({
      next: (movies: Movies) => {
        this.movies.page = movies.page;
        this.movies.results = movies.results.filter((movie, index, arr) => { return parseInt(movie.release_date) >= new Date().getFullYear() });
        this.movies.total_pages = movies.total_pages;
        this.movies.total_results = movies.total_results;
        ScrollGovernor.scrollToTop();
      }
    });
  }

  public openMovieDetails(item: Movie): void{
    OpenDialogComponent.execute(this.dialog, MovieDetailsComponent, item);
  }

  public goToPreviousPage(): void{
    let prevPage = this.movies.page - 1;
    if(prevPage == 0) return;
    this.getUpcomingMovies(`${prevPage}`);
  }

  public goToNextPage(): void{
    let nextPage = this.movies.page + 1;
    if(nextPage > this.movies.total_pages) return;
    this.getUpcomingMovies(`${nextPage}`);
  }

  public foundMovies(): boolean{
    return (typeof this.movies.results !== "undefined" && this.movies.results.length > 0);
  }

  public trackByFn(index: number, item: Movie): string{
    return `${item.id}`;
  }

  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
