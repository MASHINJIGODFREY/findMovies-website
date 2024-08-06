import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cache, CacheResponse } from '../models';

const MAX_CACHE_LIFE: number = 86400000; // 24 hrs

@Injectable({
  providedIn: 'root'
})

export class CacheService {
  private cache: Map<string, CacheResponse> = new Map();
  private allowedRequestMethods: Array<string> = ["GET"];
  private cacheRefreshTriggeringMethods: Array<string> = ["POST", "PUT", "PATCH", "DELETE"];

  constructor() { }

  public requestMethodAllowed(requestMethod: string): boolean{
    return this.allowedRequestMethods.includes(requestMethod);
  }

  public isRefreshTriggeringMethod(requestMethod: string): boolean{
    return this.cacheRefreshTriggeringMethods.includes(requestMethod);
  }

  public get(request: HttpRequest<any>): HttpResponse<any> | null{
    const cachedResponse: CacheResponse | undefined = this.cache.get(request.urlWithParams);
    if(cachedResponse){
      let response: HttpResponse<any> = cachedResponse.response;
      let setDate: Date = cachedResponse.date;
      if((Date.now() - setDate.getTime()) < MAX_CACHE_LIFE){
        return response;
      }
      this.destroy();
    }
    return null;
  }

  public set(request: HttpRequest<any>, response: HttpResponse<any>): void{
    this.cache.set(request.urlWithParams, {response: response, date: new Date()});
  }

  public destroy(): void{
    this.cache.clear();
  }
}
