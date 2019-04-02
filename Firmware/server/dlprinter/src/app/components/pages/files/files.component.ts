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
    displayGCodes: new FormControl(),
    displayOthers: new FormControl(),
    tableDisplay: new FormControl(),
  });
  constructor(private ws: WebSocketService, protected sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.optionsForm.setValue({
      displaySvg: this.sessionStorageService.filesDisplayOptions.value.displaySvg,
      displayStl: this.sessionStorageService.filesDisplayOptions.value.displayStl,
      displayGCodes: this.sessionStorageService.filesDisplayOptions.value.displayGCodes,
      displayOthers: this.sessionStorageService.filesDisplayOptions.value.displayOthers,
      tableDisplay: this.sessionStorageService.filesDisplayOptions.value.tableDisplay,
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
          } else if ( file.type === 'gcode' &&
            !this.sessionStorageService.filesDisplayOptions.value.displayGCodes) {
            return false;
          } else if ( file.type === 'other' &&
            !this.sessionStorageService.filesDisplayOptions.value.displayOthers) {
            return false;
          }
          return true;
        })),
      ).subscribe( files => { this.files = files; console.log(files); } )
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
