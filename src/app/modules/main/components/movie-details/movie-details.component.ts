import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Movie, MovieDetails, OMDB, Torrent, Tuhinpal, Videos } from 'src/app/models';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ImgService, MovieService, OmdbService, TorrentService, TuhinpalService } from 'src/app/services';
import { catchError, finalize, switchMap, takeUntil, timeout } from 'rxjs/operators';
import { combineLatest, of, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeIn } from 'src/app/animations';
import { TorrentsComponent } from '../torrents/torrents.component';

@Component({
  selector: 'app-movie-details',
  animations: [fadeIn],
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public fetchingMovieDetails: boolean = false;
  public fetchingTorrents: boolean = false;
  public loadingTorrents: boolean = false;
  public torrents: Array<Torrent> = new Array();
  public torrentsDisabled: boolean = true;
  public movie_details: MovieDetails = new MovieDetails();
  public tuhinpal_details: Tuhinpal = new Tuhinpal();
  public movie_trailer_URL: string = "";
  public movieTrailerFound: boolean = false;

  constructor(private dialogRef: MatDialogRef<MovieDetailsComponent>, private torrentClient: TorrentService, private tuhinpal: TuhinpalService, private omdb: OmdbService, private movie: MovieService, public  image: ImgService, private snackBar: MatSnackBar, private bottomSheet: MatBottomSheet, @Inject(MAT_DIALOG_DATA) public data: Movie) { }

  ngOnInit(): void {
    this.fetchingMovieDetails = true;
    combineLatest([
      this.movie.details(this.data.id),
      this.movie.details(this.data.id).pipe(switchMap((details) => this.tuhinpal.item(`${details.imdb_id}`))),
      this.movie.details(this.data.id).pipe(switchMap((details) => this.omdb.details(`${details.imdb_id}`))),
      this.movie.videos(this.data.id)
    ])
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.fetchingMovieDetails = false; }))
    .subscribe({
      next: (response: [MovieDetails, Tuhinpal, OMDB, Videos]) => {
        this.movie_details = response[0];
        this.tuhinpal_details = response[1];
        this.processMovieVideos(response[3]);
        (response[0].status.toString() === "Released") ? this.torrentsDisabled = false : this.torrentsDisabled = true;
      },
      error: (error: any) => {
        this.snackBar.open(error.message, "Ok", { duration: 2000 });
        this.dialogRef.close();
      }
    });
  }

  public getTorrents(title: string): void{
    this.torrents.splice(0, this.torrents.length);
    let torrentsAvailableInCache = this.torrentClient.isTorrentResponseSaved(title);
    this.fetchingTorrents = true;
    this.loadingTorrents = false;
    this.torrentClient.fetch(title)
    .pipe(timeout(120000), catchError(error => of(`Request timeout`)), takeUntil(this._destroyed$), finalize(() => { this.fetchingTorrents = false; }))
    .subscribe({
      next: (results: string | Array<Array<Torrent>>) => {
        if(typeof results !== "string"){
          this.fetchingTorrents = false;
          this.loadingTorrents = true;
          results.forEach((result, i, data) => {
            result.forEach((value, index, array) => {
              this.torrents.push(value);
            });
          });
          const regex = this.generateMovieTorrentRegExp(title, this.data.release_date);
          this.torrents = this.torrents.filter((torrent, index, torrents) => regex.test(torrent.Name.toString()));
          this.torrents = this.torrents.sort((a, b) => parseInt(b.Seeders) - parseInt(a.Seeders));
          this.torrents = this.torrents.slice(0, 40);
          this.loadingTorrents = false;
          if (this.torrents.length < 1) {
            this.torrentClient.clearTorrentResponse(title);
            this.snackBar.open("Torrents not found!!!.", "Retry", { duration: 3000 }).onAction().subscribe({
              next: () => { this.getTorrents(title); }
            });
          }else{
            let bottomsheetRef = this.openMovieTorrents(this.torrents);
            bottomsheetRef.afterOpened().subscribe(result => {
              if(torrentsAvailableInCache){
                this.snackBar.open("Viewing Saved Torrents!", "Reload", { duration: 3000 }).onAction().subscribe(results => {
                  bottomsheetRef.dismiss();
                  this.torrentClient.clearTorrentResponse(title);
                  this.getTorrents(title);
                });
              }
            });
            bottomsheetRef.afterDismissed().subscribe(response => {
              if(typeof response === "string" && response !== null && response !== ""){
                this.snackBar.open(response, "OK", { duration: 3000 });
              }
            });
          }
        }else{
          this.snackBar.open(results, "", { duration: 3000 });
        }
      },
      error: (error: any) => {
        this.snackBar.open(error.message, "Ok", { duration: 2000 });
      }
    });
  }

  private generateMovieTorrentRegExp(needle: string, release_date: string): RegExp{
    let year = `${new Date(release_date).getFullYear()}`;
    needle = needle.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_'{|}~]/g, " ");
    needle = needle.replace(/\s{2,}/g, " ");
    var needleArr = needle.split(' ');
    var needleSize = needleArr.length;
    var expression = '';
    if (needleSize > 1) {
      expression = needleArr.join('[\\s|\\.|\\-]');
      expression += `([\\s|\\.]?\\(|[\\s|\\.])${year}(\\)?[\\s|\\.]?)`;
    }else{
      expression = needle + `([\\s|\\.]?\\(|[\\s|\\.])${year}(\\)?[\\s|\\.]?)`;
    }
    return new RegExp(expression, 'i');
  }

  private processMovieVideos(videos: Videos): void{
    let v = videos.results;
    v = v.filter((video, i, arr) => video.site === "YouTube" && video.type === "Trailer" && video.official === true);
    v = v.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    if(v.length > 0){
      this.movieTrailerFound = true;
      this.movie_trailer_URL = `https://www.youtube.com/embed/${v[0].key}?rel=0`;
    }else{
      this.movieTrailerFound = false;
    }
  }

  private openMovieTorrents(torrents: Array<Torrent>): MatBottomSheetRef<TorrentsComponent>{
    return this.bottomSheet.open(TorrentsComponent, { data: torrents });
  }

  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
