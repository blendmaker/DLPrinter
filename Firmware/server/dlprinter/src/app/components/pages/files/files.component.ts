import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SessionStorageService, FilesDisplayOptions } from 'src/app/services/session-storage.service';
import { Subscription } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { FileMeta } from '../../../../../../../src/interfaces/FileMeta';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  protected files: FileMeta[][] = [];
  protected optionsForm = new FormGroup({
    displaySvg: new FormControl(),
    displayStl: new FormControl(),
    displayOthers: new FormControl(),
    itemCount: new FormControl(),
  });
  constructor(private ws: WebSocketService, protected sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.optionsForm.setValue({
      displaySvg: this.sessionStorageService.filesDisplayOptions.value.displaySvg,
      displayStl: this.sessionStorageService.filesDisplayOptions.value.displayStl,
      displayOthers: this.sessionStorageService.filesDisplayOptions.value.displayOthers,
      itemCount: this.sessionStorageService.filesDisplayOptions.value.itemCount,
    });

    this.subscription.push(
      this.ws.pipe(
        filter( msg => msg.cmd === 'get-files'),
        map( msg => msg.data.filter( file => {
          if ( file.type === 'svg' &&
            !this.sessionStorageService.filesDisplayOptions.value.displaySvg) {
            return false;
          } else if ( file.type === 'stl' &&
            !this.sessionStorageService.filesDisplayOptions.value.displayStl) {
            return false;
          } else if ( file.type === 'other' &&
            !this.sessionStorageService.filesDisplayOptions.value.displayOthers) {
            return false;
          }
          return true;
        })),
        map( files => files.length === 0 ? files : files.reduce( (acc, file) => {
          if (Array.isArray(acc)) {
            if ( acc[acc.length - 1].length === this.sessionStorageService.filesDisplayOptions.value.itemCount ) {
              acc[acc.length] = [ file ];
            } else {
              acc[acc.length - 1].push(file);
            }
          } else if (typeof acc === 'object') {
            acc = [ [ file ] ];
          }
          return acc;
        })),
      ).subscribe( files => this.files = files )
    );

    this.subscription.push(
      this.optionsForm.valueChanges.subscribe(
        formData => {
          this.sessionStorageService.filesDisplayOptions.next( formData );
          this.ws.send({ cmd : 'get-files' });
        }
      )
    );

    this.ws.connected.pipe( filter(connected => connected), first() ).subscribe( () => this.ws.send({ cmd : 'get-files' }) );
  }

  ngOnDestroy(): void {
    this.subscription.forEach( subscription => subscription.unsubscribe() );
    this.subscription = [];
  }

  protected printFile(file: FileMeta) {
  }

  protected inspectFile(file: FileMeta) {
  }

  protected deleteFile(file: FileMeta) {
    this.ws.send({ cmd: 'delete-file', data: file });
  }
}
