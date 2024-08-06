import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, timeout } from 'rxjs/operators';
import { fadeIn } from 'src/app/animations';
import { ScrollGovernor } from 'src/app/factories/scroll-governor';
import { Episode, Season, Series, SeriesDetails, Torrent, Tuhinpal, Videos } from 'src/app/models';
import { ImgService, OmdbService, SeriesService, TorrentService, TuhinpalService } from 'src/app/services';
import { TorrentsComponent } from '../torrents/torrents.component';

@Component({
  selector: 'app-series-details',
  animations: [fadeIn],
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './series-details.component.html',
  styleUrls: ['./series-details.component.css']
})
export class SeriesDetailsComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public fetchingTVShowDetails: boolean = false;
  public fetchingTVSeasonDetails: boolean = false;
  public fetchingTorrents: boolean = false;
  public loadingTorrents: boolean = false;
  public torrents: Array<Torrent> = new Array();
  public torrentsDisabled: boolean = true;
  public torrentsFound: boolean = false;
  public tvshow_details: SeriesDetails = new SeriesDetails();
  public tvseasons_details: Array<Season> = new Array();
  public tuhinpal_details: Tuhinpal = new Tuhinpal();
  public season_trailer_URL: string = "";
  public seasonTrailerFound: boolean = false;

  @ViewChild(MatAccordion) accordion: MatAccordion = new MatAccordion;
  @ViewChild('scrollTargetElement') private seasonsScrollContainer!: ElementRef<HTMLElement>;

  constructor(private dialogRef: MatDialogRef<SeriesDetailsComponent>, private tv: SeriesService, private torrentClient: TorrentService, private tuhinpal: TuhinpalService, public  image: ImgService, private snackBar: MatSnackBar, private bottomSheet: MatBottomSheet, @Inject(MAT_DIALOG_DATA) public data: Series) { }

  ngOnInit(): void {
    this.fetchingTVShowDetails = true;
    combineLatest([
      this.tv.details(this.data.id),
      this.tv.external_ids(this.data.id).pipe(switchMap((external_ids) => this.tuhinpal.item(external_ids.imdb_id)))
    ])
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.fetchingTVShowDetails = false; }))
    .subscribe({
      next: (response: [SeriesDetails, Tuhinpal]) => {
        this.tvshow_details = response[0];
        if(this.tvshow_details.seasons.some((season, index, arr) => season.season_number === 0)) this.tvshow_details.seasons.splice(0,1);
        this.tuhinpal_details = response[1];
        this.tvseasons_details = new Array<Season>(this.tvshow_details.number_of_seasons);
        (response[0].status.toString() === "Returning Series" || response[0].status.toString() === "Ended") ? this.torrentsDisabled = false : this.torrentsDisabled = true;
      },
      error: (error: any) => {
        this.snackBar.open(error.message, "Ok", { duration: 2000 });
        this.dialogRef.close();
      }
    });
  }

  public getTVSeasonDetails(tvshow_id: number, season_number: number): void{
    this.fetchingTVSeasonDetails = true;
    combineLatest([
      this.tv.season(tvshow_id, season_number),
      this.tv.season_videos(tvshow_id, season_number)
    ])
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.fetchingTVSeasonDetails = false; }))
    .subscribe({
      next: (response: [Season, Videos]) => {
        this.tvseasons_details[season_number] = response[0];
        this.processTVSeasonVideos(response[1]);
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
          const regex = this.generateTVTorrentRegExp(title);
          this.torrents = this.torrents.filter((torrent, index, torrents) => regex.test(torrent.Name.toString()));
          this.loadingTorrents = false;
          if(this.torrents.length < 1){
            this.accordion.closeAll();
            this.torrentsFound = false;
            this.torrentClient.clearTorrentResponse(title);
            this.snackBar.open("Torrents not found!!!.", "Retry", { duration: 3000 }).onAction().subscribe({
              next: () => { this.getTorrents(title); }
            });
          }else{
            this.torrentsFound = true;
            this.accordion.openAll();
            ScrollGovernor.scrollToBottom(this.seasonsScrollContainer);
            if(torrentsAvailableInCache){
              this.snackBar.open("Retrieved Saved Torrents!", "Reload", { duration: 3000 }).onAction().subscribe(results => {
                this.torrentClient.clearTorrentResponse(title);
                this.getTorrents(title);
              });
            }
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

  private createSearchIndex(title: string, season_number: number, episode_number: number): string{
    return ``;
  }

  public viewSeasonTorrents(season_number: number): void{
    let index1 = this.createSeasonIndex(season_number);
    let index2 = `Season ${season_number}`;
    let regExp1 = new RegExp(`[\\s|\\.]${index1}[\\s|\\.]`, 'i');
    let regExp2 = new RegExp(`[\\s|\\.]${index2}[\\s|\\.]`, 'i');
    let seasons = this.torrents.filter((value, index, arr) => (regExp1.test(value.Name.toString()) || regExp2.test(value.Name.toString())));
    seasons = seasons.sort((a, b) => parseInt(b.Seeders) - parseInt(a.Seeders));
    if(seasons.length > 0){
      this.openTorrents(seasons).afterDismissed().subscribe(response => this.bottomSheetDismissHandler(response));
    }else{
      this.snackBar.open("Torrents not available!!!.", "Ok");
    }
  }

  public viewEpisodeTorrents(season_number: number, episode_number: number): void{
    let index = this.createEpisodeIndex(season_number, episode_number);
    let regExp = new RegExp(`[\\s|\\.]${index}[\\s|\\.]`, 'i');
    let episodes = this.torrents.filter((value, index, arr) => regExp.test(value.Name.toString()));
    episodes = episodes.sort((a, b) => parseInt(b.Seeders) - parseInt(a.Seeders));
    if(episodes.length > 0){
      this.openTorrents(episodes).afterDismissed().subscribe(response => this.bottomSheetDismissHandler(response));
    }else{
      this.snackBar.open("Torrents not available!!!.", "Ok");
    }
  }

  public createSeasonIndex(season_number: number): string{
    let index = '';
    (season_number > 9) ? index = `S${season_number}` : index = `S0${season_number}`;
    return `${index}`;
  }

  public createEpisodeIndex(season_number: number, episode_number: number): string{
    let index = '';
    index = this.createSeasonIndex(season_number);
    (episode_number > 9) ? index = `${index}E${episode_number}` : index = `${index}E0${episode_number}`;
    return `${index}`;
  }

  private generateTVTorrentRegExp(needle: string): RegExp{
    needle = needle.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_'{|}~]/g, " ");
    needle = needle.replace(/\s{2,}/g, " ");
    var needleArr = needle.split(' ');
    var needleSize = needleArr.length;
    var expression = '';
    if (needleSize > 1) {
      expression = needleArr.join('[\\s|\\.|\\-]');
    }else{
      expression = needle;
    }
    // return new RegExp(`^${expression}`, 'im');
    return new RegExp(`^${expression}`, 'i');
  }

  private processTVSeasonVideos(videos: Videos): void{
    let v = videos.results;
    v = v.filter((video, i, arr) => video.site === "YouTube" && video.type === "Trailer" && video.official === true);
    v = v.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    if(v.length > 0){
      this.seasonTrailerFound = true;
      this.season_trailer_URL = `https://www.youtube.com/embed/${v[0].key}?rel=0`;
    }else{
      this.seasonTrailerFound = false;
    }
  }

  public extractSeriesDuration(first_air_date: string, last_air_date: string): string{
    let start_year = this.extractYear(first_air_date);
    let last_year = this.extractYear(last_air_date);
    return (start_year === last_year) ? `${start_year}` : `${start_year} - ${last_year}`;
  }

  public extractYear(date: string): string{
    if(typeof date !== "undefined" && date !== null && date !== ""){
      let d = new Date(date);
      return `${d.getFullYear()}`;
    }
    return "...";
  }

  private openTorrents(torrents: Array<Torrent>): MatBottomSheetRef<TorrentsComponent>{
    return this.bottomSheet.open(TorrentsComponent, { data: torrents });
  }

  private bottomSheetDismissHandler(response: any): void{
    if(typeof response === "string" && response !== null && response !== ""){
      this.snackBar.open(response, "OK", { duration: 3000 });
    }
  }

  public trackByFn(index: number, item: Season | Episode): string{
    return `${item.id}`;
  }

  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
