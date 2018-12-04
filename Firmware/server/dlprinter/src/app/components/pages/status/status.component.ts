import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { MessageInterface } from '../../../../../../../src/IpcWsMessages/MessageInterface';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  constructor(private ws: WebSocketService) { }

  ngOnInit() {
    this.ws.subscribe((message: MessageInterface) => {

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
