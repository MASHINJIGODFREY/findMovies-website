import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tuhinpal } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TuhinpalService {

  constructor(private http: HttpClient) { }

  public search(title: string): Observable<{ query: string; results: Array<Tuhinpal>; }>{
    let params = new HttpParams().set("query", title);
    return this.http.get<{ query: string; results: Array<Tuhinpal>; }>(`${environment.api.tuhinpal.url}/search`, { params: params });
  }

  public item(imdb_id: string): Observable<Tuhinpal>{
    return this.http.get<Tuhinpal>(`${environment.api.tuhinpal.url}/title/${imdb_id}`, {  });
  }
}
