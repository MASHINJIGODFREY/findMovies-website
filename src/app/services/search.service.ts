import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movie, SearchResults, Series } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  public find(external_id: string, external_source: string = "imdb_id"): Observable<{"movie_results": Array<Movie>, "tv_results": Array<Series>}>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("external_source", external_source);
    return this.http.get<{"movie_results": Array<Movie>, "tv_results": Array<Series>}>(`${environment.api.tmdb.url}/find/${external_id}`, { params: params });
  }

  public search_multi(query: string, page: string = "1", include_adult: string = "false"): Observable<SearchResults>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("query", query).set("page", page).set("include_adult", include_adult);
    return this.http.get<SearchResults>(`${environment.api.tmdb.url}/search/multi`, { params: params });
  }
}
