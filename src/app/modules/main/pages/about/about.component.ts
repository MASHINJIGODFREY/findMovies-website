import { environment } from './../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { fadeIn } from 'src/app/animations';

@Component({
  animations: [fadeIn],
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public version: string = environment.version;

  constructor() { }

  ngOnInit(): void {
  }

}
