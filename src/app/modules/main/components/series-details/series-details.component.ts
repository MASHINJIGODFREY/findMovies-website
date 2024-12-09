import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, timeout } from 'rxjs/operators';
import { fadeIn } from 'src/app/animations';
import { ScrollGovernor } from 'src/app/factories/scroll-governor';
import { Episode, Season, Series, SeriesDetails, Torrent, OMDB, Tuhinpal, Videos, Torrents } from 'src/app/models';
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
  public tvshow_details: SeriesDetails = new SeriesDetails();
  public tvseasons_details: Array<Season> = new Array();
  private allowed_tvshow_status_options: Array<string> = ["Returning Series", "Ended", "Canceled"];
  public OMDB_details: OMDB = new OMDB();
  public season_trailer_URL: string = "";
  public seasonTrailerFound: boolean = false;

  @ViewChild(MatAccordion) accordion: MatAccordion = new MatAccordion;
  @ViewChild('scrollTargetElement') private seasonsScrollContainer!: ElementRef<HTMLElement>;

  constructor(private dialogRef: MatDialogRef<SeriesDetailsComponent>, private tv: SeriesService, private torrentClient: TorrentService, private omdb: OmdbService, private tuhinpal: TuhinpalService, public  image: ImgService, private snackBar: MatSnackBar, private bottomSheet: MatBottomSheet, @Inject(MAT_DIALOG_DATA) public data: Series) { }

  ngOnInit(): void {
    this.fetchingTVShowDetails = true;
    combineLatest([
      this.tv.details(this.data.id),
      this.tv.external_ids(this.data.id).pipe(switchMap((external_ids) => this.omdb.details(external_ids.imdb_id)))
    ])
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.fetchingTVShowDetails = false; }))
    .subscribe({
      next: (response: [SeriesDetails, OMDB]) => {
        this.tvshow_details = response[0];
        if(this.tvshow_details.seasons.some((season, index, arr) => season.season_number === 0)) this.tvshow_details.seasons.splice(0,1);
        this.OMDB_details = response[1];
        this.tvseasons_details = new Array<Season>(this.tvshow_details.number_of_seasons);
        this.torrentsDisabled = (this.allowed_tvshow_status_options.includes(this.tvshow_details.status.toString())) ? false : true;
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

  public getTorrents(title: string, type: string, season_number: number, episode_number: number = 0): void{
    this.torrents.splice(0, this.torrents.length);
    let torrentsAvailableInCache = this.torrentClient.isTorrentResponseSaved(title);
    this.fetchingTorrents = true;
    this.loadingTorrents = false;
    this.torrentClient.fetch(title)
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.fetchingTorrents = false; }))
    .subscribe({
      next: (results: string | Torrents) => {
        if(typeof results !== "string"){
          this.fetchingTorrents = false;
          this.loadingTorrents = true;
          results.data.forEach((value, index, array) => {
            this.torrents.push(value);
          });
          // Filter Torrents Here
          this.torrents = this.filterTorrentsByTitle(title);
          if(type == "season") this.torrents = this.filterTorrentsBySeason(season_number);
          if(type == "episode") this.torrents = this.filterTorrentsByEpisode(season_number, episode_number);
          this.torrents = this.torrents.sort((a, b) => parseInt((b.seeders).replace(/,/g, '')) - parseInt((a.seeders).replace(/,/g, '')));
          this.torrents = this.torrents.slice(0, 60);
          this.loadingTorrents = false;
          if(this.torrents.length < 1){
            this.torrentClient.clearTorrentResponse(title);
            this.snackBar.open("Torrents not found!!!.", "Retry", { duration: 3000 }).onAction().subscribe({
              next: () => { this.getTorrents(title, type, season_number, episode_number); }
            });
          }else{
            let bottomsheetRef = this.openTorrents(this.torrents);
            bottomsheetRef.afterOpened().subscribe(result => {
              if(torrentsAvailableInCache){
                this.snackBar.open("Retrieved Saved Torrents!", "Reload", { duration: 3000 }).onAction().subscribe(results => {
                  this.torrentClient.clearTorrentResponse(title);
                  this.getTorrents(title, type, season_number, episode_number);
                });
              }
            });
            bottomsheetRef.afterDismissed().subscribe(response => this.bottomSheetDismissHandler(response))
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

  public getSeasonTorrents(title: string, season_number: number): void{
    let sanitizedTitle = this.generateSearchQuery(title);
    sanitizedTitle = `${sanitizedTitle}.${this.createSeasonIndex(season_number)}`;
    this.getTorrents(sanitizedTitle, "season", season_number);
  }

  public getEpisodeTorrents(title: string, season_number: number, episode_number: number): void{
    let sanitizedTitle = this.generateSearchQuery(title);
    sanitizedTitle = `${sanitizedTitle}.${this.createEpisodeIndex(season_number, episode_number)}`;
    this.getTorrents(sanitizedTitle, "episode", season_number, episode_number);
  }

  private filterTorrentsBySeason(season_number: number): Array<Torrent>{
    let index1 = this.createSeasonIndex(season_number);
    let index2 = `Season ${season_number}`;
    let regExp1 = new RegExp(`[\\s|\\.]${index1}[\\s|\\.]`, 'i');
    let regExp2 = new RegExp(`[\\s|\\.]${index2}[\\s|\\.]`, 'i');
    return this.torrents.filter((value, index, arr) => (regExp1.test(value.name.toString()) || regExp2.test(value.name.toString())));
  }

  private filterTorrentsByEpisode(season_number: number, episode_number: number): Array<Torrent>{
    let index = this.createEpisodeIndex(season_number, episode_number);
    let regExp = new RegExp(`[\\s|\\.]${index}[\\s|\\.]`, 'i');
    return this.torrents.filter((value, index, arr) => regExp.test(value.name.toString()));
  }

  private filterTorrentsByTitle(title: string): Array<Torrent>{
    var sanitizedTitle = this.sanitizeSearchQuery(title);
    var sanitizedTitleArr = sanitizedTitle.split(' ');
    var sanitizedTitleSize = sanitizedTitleArr.length;
    var titleExpression = (sanitizedTitleSize > 1) ? sanitizedTitleArr.join('[\\s|\\.|\\-]') : sanitizedTitle;
    var titleRegex = new RegExp(`^${titleExpression}`, 'i');
    return this.torrents.filter((torrent, index, torrents) => titleRegex.test(torrent.name.toString()));
  }

  private generateSearchQuery(title: string): string{
    var sanitizedSearchQuery = this.sanitizeSearchQuery(title);
    var searchQueryArr = sanitizedSearchQuery.split(' ');
    var searchQueryArrSize = searchQueryArr.length;
    var searchQuery = (searchQueryArrSize > 1) ? searchQueryArr.join('.') : sanitizedSearchQuery;
    return searchQuery;
  }

  private sanitizeSearchQuery(query: string): string{
    query = query.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_'{|}~]/g, " ");
    return query.replace(/\s{2,}/g, " ");
  }

  private createSeasonIndex(season_number: number): string{
    var index = (season_number > 9) ? `S${season_number}` : `S0${season_number}`;
    return `${index}`;
  }

  public createEpisodeIndex(season_number: number, episode_number: number): string{
    let index = this.createSeasonIndex(season_number);
    index = (episode_number > 9) ? `${index}E${episode_number}` : `${index}E0${episode_number}`;
    return `${index}`;
  }

  public isEpisodeReleased(current_season: number, current_episode: number, next_episode_To_air: Episode): boolean{
    if(next_episode_To_air == null) return true;
    return (current_season == next_episode_To_air.season_number && current_episode >= next_episode_To_air.episode_number) ? false : true;
  }

  public areAllEpisodesReleased(current_season: number, next_episode_To_air: Episode): boolean{
    if(next_episode_To_air == null) return true;
    return (current_season == next_episode_To_air.season_number) ? false : true;
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
