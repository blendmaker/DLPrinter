import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { FileMeta } from '../../../../../../../src/interfaces/FileMeta';
import { PrinterState } from '../../../../../../../src/interfaces/PrinterState';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  protected files: FileMeta[] = [];
  protected state: PrinterState = {
    printing: false,
    z: 0,
    light: false,
  };
  protected optionsForm = new FormGroup({
    displaySvg: new FormControl(),
    displayStl: new FormControl(),
    displayOthers: new FormControl(),
    itemCount: new FormControl(),
  });
  constructor(private ws: WebSocketService, protected sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.subscription.push(
      this.ws.subscribe( msg => {
        switch (msg.cmd) {
          case 'state' : this.state = msg.data; break;
          case 'get-files' : this.files = msg.data; break;
        }
      })
    );

    this.subscription.push(
      this.optionsForm.valueChanges.subscribe(
        formData => {
          console.log(formData);
          this.sessionStorageService.filesDisplayOptions.next( formData );
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
