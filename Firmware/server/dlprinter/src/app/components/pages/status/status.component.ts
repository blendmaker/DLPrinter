import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { PrinterState } from '../../../../../../../src/printRunner';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  public state: PrinterState = {
    printing: false,
    z: 0,
    light: false,
  };
  constructor(private ws: WebSocketService) { }

  ngOnInit() {
    this.ws.subscribe( data => {
      switch (data.cmd) {
        case 'state' : this.state = data.data; break;
      }
    });
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
