import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-debug-buttons',
  templateUrl: './debug-buttons.component.html',
  styleUrls: ['./debug-buttons.component.scss']
})
export class DebugButtonsComponent {
  constructor(private ws: WebSocketService) { }

  public textClicked () {
    this.ws.send({ cmd: 'text', data: 'Ich in ein Test', });
  }
  public whiteClicked () {
    this.ws.send({ cmd: 'color', data: 'white', });
  }
  public blackClicked () {
    this.ws.send({ cmd: 'color', data: 'black', });
  }
  public layerClicked () {
    this.ws.send({ cmd: 'layer', data: {}, });
  }
}
