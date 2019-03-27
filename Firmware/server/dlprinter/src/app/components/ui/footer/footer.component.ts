import { Component, OnInit, OnDestroy } from '@angular/core';
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

  tooltipConnection = [
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

  triggerLight() {
    this.ws.send({ cmd : 'light' });
  }
  protected textClicked () {
    this.ws.send({ cmd: 'text', data: 'Ich in ein Test', });
  }
  protected whiteClicked () {
    this.ws.send({ cmd: 'color', data: 'white', });
  }
  protected blackClicked () {
    this.ws.send({ cmd: 'color', data: 'black', });
  }
  protected layerClicked () {
    this.ws.send({ cmd: 'layer', data: {}, });
  }
}
