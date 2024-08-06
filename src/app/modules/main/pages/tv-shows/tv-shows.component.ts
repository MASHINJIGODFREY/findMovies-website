import { Component, OnInit } from '@angular/core';
import { fadeIn } from 'src/app/animations';

@Component({
  animations: [fadeIn],
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './tv-shows.component.html',
  styleUrls: ['./tv-shows.component.css']
})
export class TvShowsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
