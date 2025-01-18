import { environment } from './../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { fadeIn } from 'src/app/animations';

@Component({
    animations: [fadeIn],
    host: { '[@fadeInAnimation]': '' },
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: false
})
export class AboutComponent implements OnInit {
  public version: string = environment.version;
  public github: string = environment.github;
  public tmdb: string = environment.api.tmdb.site;
  public omdb: string = environment.api.omdb.site;
  public torrent: string = environment.api.torrent.github;

  constructor() { }

  ngOnInit(): void {
  }

}
