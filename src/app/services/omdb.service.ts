import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OMDB } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {

  constructor(private http: HttpClient) { }

  public search(title: string): Observable<{Search: Array<OMDB>}>{
    let params = new HttpParams().set("apikey", environment.api.omdb.key).set("s", title);
    return this.http.get<{Search: Array<OMDB>}>(`${environment.api.omdb.url}/`, { params: params });
  }

  public details(imdb_ID: string | null): Observable<OMDB>{
    let imdbID = `${imdb_ID}`;
    let params = new HttpParams().set("apikey", environment.api.omdb.key).set("i", imdbID);
    return this.http.get<OMDB>(`${environment.api.omdb.url}/`, { params: params });
  }
}
