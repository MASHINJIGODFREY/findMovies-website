import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre, Movie, MovieDetails, Movies, Series, Videos } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  public upcoming(page: string = "1"): Observable<Movies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<Movies>(`${environment.api.tmdb.url}/movie/upcoming`, { params: params });
  }

  public now_playing(page: string = "1"): Observable<Movies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<Movies>(`${environment.api.tmdb.url}/movie/now_playing`, { params: params });
  }

  public trending(): Observable<Movies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key);
    return this.http.get<Movies>(`${environment.api.tmdb.url}/trending/movie/week`, { params: params });
  }

  public popular(page: string = "1"): Observable<Movies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<Movies>(`${environment.api.tmdb.url}/movie/popular`, { params: params });
  }

  public top_rated(page: string = "1"): Observable<Movies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<Movies>(`${environment.api.tmdb.url}/movie/top_rated`, { params: params });
  }

  public details(movie_id: number): Observable<MovieDetails>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<MovieDetails>(`${environment.api.tmdb.url}/movie/${movie_id}`, { params: params });
  }

  public videos(movie_id: number): Observable<Videos>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<Videos>(`${environment.api.tmdb.url}/movie/${movie_id}/videos`, { params: params });
  }

  public similar(movie_id: number, page: string = "1"): Observable<Movies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<Movies>(`${environment.api.tmdb.url}/movie/${movie_id}/similar`, { params: params });
  }

  public genres(): Observable<Array<Genre>>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<Array<Genre>>(`${environment.api.tmdb.url}/genre/movie/list`, { params: params });
  }
}
