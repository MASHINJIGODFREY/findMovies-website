import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { OpenDialogComponent } from 'src/app/factories/dialog-opener';
import { Torrent } from 'src/app/models';
import { UiService } from 'src/app/services';
import { DownloadComponent } from '../download/download.component';

@Component({
  selector: 'app-torrents',
  templateUrl: './torrents.component.html',
  styleUrls: ['./torrents.component.css']
})
export class TorrentsComponent implements OnInit, OnDestroy {
  public torrents: Array<{ release_format_type: string; files: Array<Torrent>; quality: string; enphasis: string; }> = new Array();
  private release_format_types = [
    {name: 'Blu-Ray', acronym: 'BluRay', quality: 'Excellent'},
    {name: 'WEBRip', acronym: 'WEBRip', quality: 'Excellent'},
    {name: 'DVDRip', acronym: 'DVDRip', quality: 'Excellent'},
    {name: 'WEB-DL', acronym: 'WEB-DL', quality: 'Excellent'},
    {name: 'HIGH DEFINITION TELEVISION', acronym: 'HDTV', quality: 'Very Good'},
    {name: 'HIGH DEFINITION TELECINE', acronym: 'HDTC', quality: 'Very Good'},
    {name: 'HDRip', acronym: 'HDRip', quality: 'Very Good'},
    {name: 'Blu-Ray Rip', acronym: 'BrRip', quality: 'Very Good'},
    {name: 'WEB', acronym: 'WEB', quality: 'Very Good'},
    {name: 'HIGH DEFINITION TELESYNC', acronym: 'HDTS', quality: 'Good'},
    {name: 'DIGITAL DISTRIBUTION COPY', acronym: 'DDC', quality: 'Good'},
    {name: 'TELECINE', acronym: 'TC', quality: 'Good'},
    {name: 'DVD-SCREENER', acronym: 'DVDscr', quality: 'Poor'},
    {name: 'TELESYNC', acronym: 'TS', quality: 'Poor'},
    {name: 'SCREENER', acronym: 'SCR', quality: 'Very Poor'},
    {name: 'CAMRip', acronym: 'CAMRip', quality: 'Very Poor'},
  ];

  constructor(private ui: UiService, private dialog: MatDialog, private snackBar: MatSnackBar, private bottomSheetRef: MatBottomSheetRef<TorrentsComponent>, private clipboardService: ClipboardService, @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data: Array<Torrent>) { }

  ngOnInit(): void {
    this.ui.showSpinner();
    this.release_format_types.forEach((format_type, index, arr) => {
      let indices = new Array();
      let regex = new RegExp(`[\\s|\\.|\\_|\\-|\\[]${format_type.acronym}[\\s|\\.|\\_|\\-|\\]]`, 'i');
      let files = this.data.filter((torr, indx, arry) => {
        if((regex.test(torr.Name.toString()) === true) || (regex.test(torr.Url.toString()) === true)){
          indices.push(indx);
          return true;
        }else{
          return false;
        }
      });
      if(files.length > 0){
        this.torrents.push({
          release_format_type: format_type.acronym,
          files: files,
          quality: `${format_type.quality} Quality`,
          enphasis: this.generateColorCode(format_type.quality)
        });
        let iterables = indices.length;
        for(let i = 0; i < iterables; i++){
          this.data.splice(indices[i], 1);
          for(let j = i+1; j < iterables; j++) {
            if(indices[i] < indices[j]){
              indices[j]--;
            }
          }
        }
      }
    });
    if(this.data.length > 0){
      this.torrents.push({
          release_format_type: 'Oblivious',
          files: this.data,
          quality: 'Unknown Quality',
          enphasis: this.generateColorCode("Unrecognized")
      });
    }
    this.ui.stopSpinner();
    if(this.torrents.length < 1) this.bottomSheetRef.dismiss("Torrents not recognized");
  }

  private generateColorCode(quality: string): string{
    let colors = [
      {qty: 'Excellent', code: '#008000'},
      {qty: 'Very Good', code: '#ADFF2F'},
      {qty: 'Good', code: '#FFFF00'},
      {qty: 'Poor', code: '#FFA500'},
      {qty: 'Very Poor', code: '#FF0000'},
      {qty: 'Unrecognized', code: '#808080'}
    ];
    let match = colors.filter((color, index, arr) => color.qty === quality);
    return match[0].code;
  }

  public copy(file: Torrent): void{
    if(typeof file.Magnet !== "undefined" && file.Magnet !== null && file.Magnet !== ""){
      return this.clipboardService.copy(file.Magnet);
    }else if(typeof file.Torrent !== "undefined" && file.Torrent !== null && file.Torrent !== ""){
      return this.clipboardService.copy(file.Torrent);
    }else{
      this.snackBar.open("Unable to access Torrent link!", "Ok", { duration: 3000 });
    }
  }

  // To be implemented in the future
  private promptDownload(magnetLink: string): void{
    this.snackBar.open("Torrent ready for download", "Proceed", { duration: 3000 }).onAction().subscribe({
      next: () => {
        this.clipboardService.copy(magnetLink);
        OpenDialogComponent.execute(this.dialog, DownloadComponent, magnetLink);
      }
    });
  }

  public calibrateMeasure(count: string | number): string{
    let num = parseInt(`${count}`);
    if(num > 0){
      return `${count}`;
    }else{
      return 'unknown';
    }
  }

  public determineResolution(filename: string): string{
    let regex5760p = new RegExp(`[\\s|\\.|\\_|\\-|\\[]5760p[\\s|\\.|\\_|\\-|\\]]`, 'i');
    let regex4320p = new RegExp(`[\\s|\\.|\\_|\\-|\\[]4320p[\\s|\\.|\\_|\\-|\\]]`, 'i');
    let regex2160p = new RegExp(`[\\s|\\.|\\_|\\-|\\[]2160p[\\s|\\.|\\_|\\-|\\]]`, 'i');
    let regex1200p = new RegExp(`[\\s|\\.|\\_|\\-|\\[]1200p[\\s|\\.|\\_|\\-|\\]]`, 'i');
    let regex1080p = new RegExp(`[\\s|\\.|\\_|\\-|\\[]1080p[\\s|\\.|\\_|\\-|\\]]`, 'i');
    let regex720p = new RegExp(`[\\s|\\.|\\_|\\-|\\[]720p[\\s|\\.|\\_|\\-|\\]]`, 'i');
    if(regex5760p.test(filename.toString()) === true){
      return "5760p";
    }else if(regex4320p.test(filename.toString()) === true){
      return "4320p";
    }else if(regex2160p.test(filename.toString()) === true){
      return "2160p";
    }else if(regex1200p.test(filename.toString()) === true){
      return "1200p";
    }else if(regex1080p.test(filename.toString()) === true){
      return "1080p";
    }else if(regex720p.test(filename.toString()) === true){
      return "720p";
    }else{
      return "unknown";
    }
  }

  public trackByFn(index: number, item: any): string{
    return `${index}`;
  }

  ngOnDestroy(): void {
    this.data.splice(0, this.data.length);
    this.torrents.splice(0, this.torrents.length);
  }
}
