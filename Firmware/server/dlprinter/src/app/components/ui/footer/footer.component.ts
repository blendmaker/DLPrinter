import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { interval } from 'rxjs';
import { MessageInterface } from '../../../../../../../src/IpcWsMessages/MessageInterface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  connected = false;
  printerStatus = {
    printing : false,
    z : 0.0,
    light : false,
  };

  tooltipConnection = [
    'You are currently connected to the printer.',
    'No connection to printer present.'
  ];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.webSocketService.subscribe((msg: MessageInterface|string|any) => {
      if (typeof msg === 'string') {
        msg = JSON.parse(msg);

        if (msg.cmd === 'state') {
          this.printerStatus = msg.data;
        }
      }
    });
    interval(2000).subscribe(() => {
      this.connected = this.webSocketService.send({cmd : 'heartbeat', data : {}});
    });
  }

  triggerLight(event$: any) {
    console.log(event$);
    this.webSocketService.send({ cmd : 'light' });
  }
}
