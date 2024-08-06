import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryCodesService {

  constructor(private http: HttpClient) { }

  public iso3(): Observable<Array<string>>{
    return this.http.get<Array<string>>(`${environment.api.country_codes.url.iso3}/`, {  });
  }

  public names(): Observable<Array<string>>{
    return this.http.get<Array<string>>(`${environment.api.country_codes.url.names}/`, {  });
  }
}
