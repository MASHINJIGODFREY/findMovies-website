import { ApplicationRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, finalize, Observable, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import { OpenDialogComponent } from 'src/app/factories/dialog-opener';
import { SearchedMovie, SearchedPerson, SearchedTVShow, SearchResults } from 'src/app/models';
import { SearchService } from 'src/app/services';
import { MovieDetailsComponent, SeriesDetailsComponent } from '../../components';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  private _destroyed$: Subject<boolean> = new Subject();
  public items: Array<{ title: string; object: SearchedMovie & SearchedTVShow & SearchedPerson }> = new Array();
  public searchingItems: boolean = false;
  public searchField: FormControl = new FormControl('');
  private searchFieldObserver!: Subscription;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private applicationRef: ApplicationRef, private search: SearchService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.searchField = this.fb.control('');
    this.searchFieldObserver = this.searchField.valueChanges
    .pipe(debounceTime(500), distinctUntilChanged(), switchMap(inputValue => {
      return this.searchItems(inputValue);
    })).subscribe({
      next: (response: SearchResults) => {
        let results = response.results;
        results.forEach((value, index, arr) => {
          if(value.media_type.toString() === "movie"){
            this.items.push({
              title: `${value.title}(${this.extractYear(value.release_date)}) - <em>${value.media_type}<em>`,
              object: value
            });
          }else if(value.media_type.toString() === "tv"){
            this.items.push({
              title: `${value.name}(${this.extractYear(value.first_air_date)}) - <em>${value.media_type}</em>`,
              object: value
            });
          }
        });
        if(this.items.length < 1) this.snackBar.open("No Results Found!", "Ok", { duration: 2000 });
      },
      error: (error: any) => {
        this.snackBar.open(error.message, "Ok", { duration: 2000 });
      }
    });
  }

  public searchItems(query: string): Observable<SearchResults>{
    this.emptySearchedResults();
    this.searchingItems = true;
    this.applicationRef.tick();
    return this.search.search_multi(query)
    .pipe(take(1), takeUntil(this._destroyed$), finalize(() => { 
      this.searchingItems = false;
      this.applicationRef.tick(); 
    }));
  }

  public openDetails(item: SearchedMovie & SearchedTVShow & SearchedPerson): void{
    this.searchInput.nativeElement.blur();
    if(item.media_type.toString() === "movie"){
      this.searchInput.nativeElement.value = `${item.title}`;
      OpenDialogComponent.execute(this.dialog, MovieDetailsComponent, item).afterClosed().subscribe(result => {
        this.emptySearchInput();
      });
    }else if(item.media_type.toString() === "tv"){
      this.searchInput.nativeElement.value = `${item.name}`;
      OpenDialogComponent.execute(this.dialog, SeriesDetailsComponent, item).afterClosed().subscribe(result => {
        this.emptySearchInput();
      });
    }else{
      this.snackBar.open("Details not available!.", "Ok", { duration: 2000 });
    }
    this.emptySearchedResults();
  }

  public emptySearchedResults(): void{
    this.items.splice(0, this.items.length);
  }

  private emptySearchInput(): void{
    this.searchInput.nativeElement.value = ``;
  }

  private extractYear(date: string): number{
    return new Date(`${date}`).getFullYear();
  }

  public trackByFn(index: number, item: { title: string; object: SearchedMovie & SearchedTVShow & SearchedPerson }): string{
    return `${item.object.id}`;
  }

  ngOnDestroy(): void {
      this._destroyed$.next(true);
      this._destroyed$.complete();
      this.searchFieldObserver.unsubscribe();
  }
}
