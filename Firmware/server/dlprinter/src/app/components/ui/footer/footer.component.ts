import { Component, OnInit, OnDestroy, isDevMode } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { interval, Subscription } from 'rxjs';
import { MessageInterface } from '../../../../../../../src/interfaces/MessageInterface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  protected connected = false;
  protected printerStatus = {
    printing : false,
    z : 0.0,
    light : false,
  };
  protected isDebug = isDevMode;

  protected tooltipConnection = [
    'You are currently connected to the printer.',
    'No connection to printer present.'
  ];

  constructor(private ws: WebSocketService) { }

  ngOnInit() {
    this.subscription.push(
      this.ws.subscribe((msg: MessageInterface|string|any) => {
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

  protected triggerLight() {
    this.ws.send({ cmd : 'light' });
  }
}
