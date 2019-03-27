import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-debug-buttons',
  templateUrl: './debug-buttons.component.html',
  styleUrls: ['./debug-buttons.component.scss']
})
export class DebugButtonsComponent {
  constructor(private ws: WebSocketService) { }

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
