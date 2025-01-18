import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public version: string = environment.version;
  public copyright: string = environment.copyright;
  public github: string = environment.github;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }
}
