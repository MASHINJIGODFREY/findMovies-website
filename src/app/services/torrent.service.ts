import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheBucket, HttpCacheManager, withCache, requestDataChanged } from '@ngneat/cashew';
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

  public fetch(title: string, limit: number = 8): Observable<Torrents>{
    let params = new HttpParams().set("query", `${title}`).set("limit", limit);
    const url = `${this.baseURL}/search`;
    return this.http.get<Torrents>(`${url}`, { params: params, context: withCache({ cache: true, ttl: 432000000, version: 'v0.0.4', key: `${title}`, bucket: this.torrentBucket, clearCachePredicate: requestDataChanged }) });
  }

  public isTorrentResponseSaved(titleParam: string): boolean{
    return this.manager.has(titleParam);
  }

  public clearTorrentResponse(titleParam: string): void{
    return this.manager.delete(titleParam);
  }

  public clearAllSavedTorrentResponses(): void{
    return this.manager.delete(this.torrentBucket);
  }
}
