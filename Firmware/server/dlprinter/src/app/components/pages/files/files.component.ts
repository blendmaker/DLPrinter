import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { filter, first, map, debounce, debounceTime } from 'rxjs/operators';
import { FileMeta } from '../../../../../../../src/Interfaces/FileMeta';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  private remoteFiles: FileMeta[] = [];
  public files: FileMeta[] = [];
  public optionsForm = new FormGroup({
    displaySvg: new FormControl(),
    displayStl: new FormControl(),
    displayGCodes: new FormControl(),
    displayOthers: new FormControl(),
    tableDisplay: new FormControl(),
    // filterDisplay: new FormControl(),
  });
  public filterDisplay = new BehaviorSubject<string>('');
  constructor(private ws: WebSocketService, public sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.optionsForm.patchValue({
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
      ).subscribe( files => { this.remoteFiles = files; this.filterDisplay.next(''); } )
    );

    this.subscription.push(
      this.optionsForm.valueChanges.subscribe(
        formData => {
          this.sessionStorageService.filesDisplayOptions.next(formData);
          this.ws.send({ cmd : 'get-files' });
        }
      )
    );

    this.subscription.push(
      this.filterDisplay.subscribe( term =>
        this.files = this.remoteFiles.filter(file =>
          (!term) ||
          file.name.indexOf(term) !== -1 ||
          (file.description && file.description.indexOf(term) !== -1))
      )
    );

    this.ws.connected.pipe( filter(connected => connected), first() ).subscribe( () => this.ws.send({ cmd : 'get-files' }) );
  }

  ngOnDestroy(): void {
    this.subscription.forEach( subscription => subscription.unsubscribe() );
    this.subscription = [];
  }

  public processFile(file: FileMeta) {
  }

  public inspectFile(file: FileMeta) {
  }

  public deleteFile(file: FileMeta) {
    this.ws.send({ cmd: 'delete-file', data: file });
  }
}
