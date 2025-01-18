import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { WebTorrent } from 'webtorrent';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var WebTorrent: WebTorrent;

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  public loading: boolean = true;
  public infoHash: string = '';
  public name: string = '';
  public progress: string = '';
  private client = new WebTorrent();

  @ViewChild('download-portal') public downloadPortal!: ElementRef<HTMLElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public magnetLink: string, private dialogRef: MatDialogRef<DownloadComponent>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Download using WebTorrent
    const magnetURL = this.magnetLink;
    // const magnetURL = 'https://webtorrent.io/torrents/sintel.torrent';
    this.client.on('error', (err) => {
      this.snackBar.open(`CLIENT ERROR: ${err}`, 'Dismiss').onAction().subscribe({
        next: () => { this.close(); }
      });
    });
    this.client.add(magnetURL, (torrent) => {
      torrent.on('error', (err) => {
        this.snackBar.open(`TORRENT ERROR: ${err}`, 'Dismiss').onAction().subscribe({
          next: () => { this.close(); }
        });
      });
      this.infoHash = torrent.infoHash;
      this.name = torrent.name;
      this.loading = false;
      this.progress = 'Torrent Retrieval Starting...'
      const interval = setInterval(() => {
        this.progress = 'Torrent Retrieval Progress: ' + (torrent.progress * 100).toFixed(1) + '%';
      }, 1000);
      torrent.on('done', () => {
        this.progress = 'Torrent Retrieval Progress: 100%';
        clearInterval(interval);
      });
      torrent.files.forEach((file, index, arr) => {
        if(file.name.endsWith('.srt') || file.name.endsWith('.mp4') || file.name.endsWith('.avi') || file.name.endsWith('.mkv') || file.name.endsWith('.mpeg')){
          file.getBlobURL((err, url) => {
            if(err) throw err;
            const a = document.createElement('a');
            a.target = "_blank";
            a.href = url ? url : '';
            a.textContent = 'Download full file: ' + file.name;
            this.downloadPortal.nativeElement.append(a);
          });
        }
      });
    });
  }

  public close(): void{
    this.client.destroy();
    this.dialogRef.close();
  }
}
