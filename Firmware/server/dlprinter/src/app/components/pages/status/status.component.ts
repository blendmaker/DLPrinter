import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { FileMeta } from '../../../../../../../src/interfaces/FileMeta';
import { PrinterState } from '../../../../../../../src/interfaces/PrinterState';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  protected files: FileMeta[] = [];
  protected state: PrinterState = {
    printing: false,
    z: 0,
    light: false,
  };
  constructor(private ws: WebSocketService) { }

  ngOnInit() {
    this.subscription.push(
      this.ws.subscribe( msg => {
        switch (msg.cmd) {
          case 'state' : this.state = msg.data; break;
          case 'get-files' : this.files = msg.data; break;
        }
      })
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
