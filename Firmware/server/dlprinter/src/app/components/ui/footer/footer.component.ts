import { Component, OnInit, OnDestroy, isDevMode } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { interval, Subscription } from 'rxjs';
import { Message } from '../../../../../../../src/Interfaces/Message';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  public connected = false;
  public printerStatus = {
    printing : false,
    z : 0.0,
    light : false,
  };
  public isDebug = isDevMode;

  public tooltipConnection = [
    'You are currently connected to the printer.',
    'No connection to printer present.'
  ];

  constructor(private ws: WebSocketService) { }

  ngOnInit() {
    this.subscription.push(
      this.ws.subscribe((msg: Message) => {
        if (msg.cmd === 'state') {
          this.printerStatus = msg.data;
        }
      })
    );
    this.subscription.push(interval(2000).subscribe(() => {
      this.connected = this.ws.send({ cmd : 'heartbeat' });
    }));
  }

  ngOnDestroy(): void {
    this.subscription.forEach( subscription => subscription.unsubscribe() );
    this.subscription = [];
  }

  public triggerLight() {
    this.ws.send({ cmd : 'light' });
  }
}
