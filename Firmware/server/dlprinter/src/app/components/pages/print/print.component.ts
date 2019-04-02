import { WebSocketService } from './../../../services/web-socket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PrinterState } from '../../../../../../../src/Interfaces/PrinterState';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit, OnDestroy {
  protected state: PrinterState;
  private subscription: Subscription[] = [];
  constructor(private ws: WebSocketService) { }

  ngOnInit() {
    this.subscription.push(
      this.ws.subscribe( msg => {
        switch (msg.cmd) {
          case 'state' : this.state = msg.data; break;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach( subscription => subscription.unsubscribe() );
    this.subscription = [];
  }
}
