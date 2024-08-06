import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheBucket, HttpCacheManager, withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Torrent } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {
  private baseURL = `${environment.api.torrent.url}/all`;
  private torrentBucket = new CacheBucket();

  constructor(private http: HttpClient, private manager: HttpCacheManager) { }

  public fetch(title: string): Observable<Array<Torrent[]>>{
    const url = `${this.baseURL}/${title}`;
    return this.http.get<Array<Torrent[]>>(`${url}`, { context: withCache({ cache: true, ttl: 432000000, version: 'v0.0.1', key: `${url}`, bucket: this.torrentBucket }) });
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
