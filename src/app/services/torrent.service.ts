import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheBucket, HttpCacheManager, withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Torrents } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {
  private baseURL = `${environment.api.torrent.url}/all`;
  private torrentBucket = new CacheBucket();

  constructor(private http: HttpClient, private manager: HttpCacheManager) { }

  public fetch(title: string): Observable<Torrents>{
    let params = new HttpParams().set("query", `${title}`).set("limit", "8");
    const url = `${this.baseURL}/search`;
    return this.http.get<Torrents>(`${url}`, { params: params, context: withCache({ cache: true, ttl: 432000000, version: 'v0.0.3', key: `${url}`, bucket: this.torrentBucket }) });
  }

  public isTorrentResponseSaved(titleParam: string): boolean{
    const url = `${this.baseURL}/${titleParam}`;
    return this.manager.has(url);
  }

  public clearTorrentResponse(titleParam: string): void{
    const url = `${this.baseURL}/${titleParam}`;
    return this.manager.delete(url);
  }

  public clearAllSavedTorrentResponses(): void{
    return this.manager.delete(this.torrentBucket);
  }
}
