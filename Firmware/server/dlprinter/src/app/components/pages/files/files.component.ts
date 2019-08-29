import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { BehaviorSubject } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { FileMeta } from '../../../../../../../src/Interfaces/FileMeta';
import { FormGroup, FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {
  // TODO: clear subscription arrays
  // private subscription: Subscription[] = [];
  private remoteFiles: FileMeta[] = [];
  public files: FileMeta[] = [];
  public optionsForm = new FormGroup({
    displaySvg: new FormControl(),
    displayStl: new FormControl(),
    displayGCodes: new FormControl(),
    displayOthers: new FormControl(),
    tableDisplay: new FormControl(),
  });
  public filterDisplay = new BehaviorSubject<string>('');
  constructor(private ws: WebSocketService, public sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.optionsForm.setValue({
      displaySvg: this.sessionStorageService.filesDisplayOptions.value.displaySvg,
      displayStl: this.sessionStorageService.filesDisplayOptions.value.displayStl,
      displayGCodes: this.sessionStorageService.filesDisplayOptions.value.displayGCodes,
      displayOthers: this.sessionStorageService.filesDisplayOptions.value.displayOthers,
      tableDisplay: this.sessionStorageService.filesDisplayOptions.value.tableDisplay,
    });

    this.ws.pipe(
      untilDestroyed(this),
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
    ).subscribe( files => { this.remoteFiles = files; this.filterDisplay.next(''); } );

    this.optionsForm.valueChanges.pipe(untilDestroyed(this)).subscribe(
      formData => {
        this.sessionStorageService.filesDisplayOptions.next(formData);
        this.ws.send({ cmd : 'get-files' });
      }
    );

    this.filterDisplay.pipe(untilDestroyed(this)).subscribe( term =>
      this.files = this.remoteFiles.filter(file =>
        (!term) ||
        file.name.indexOf(term) !== -1 ||
        (file.description && file.description.indexOf(term) !== -1))
    );

    this.ws.connected.pipe( filter(connected => connected), first() ).subscribe( () => this.ws.send({ cmd : 'get-files' }) );
  }

  ngOnDestroy(): void {
    // this.subscription.forEach( subscription => subscription.unsubscribe() );
    // this.subscription = [];
  }

  public processFile(file: FileMeta) {
  }

  public inspectFile(file: FileMeta) {
  }

  public deleteFile(file: FileMeta) {
    this.ws.send({ cmd: 'delete-file', data: file });
  }
}
