import { Component, OnInit } from '@angular/core';
import { fadeIn } from 'src/app/animations';

@Component({
  animations: [fadeIn],
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
