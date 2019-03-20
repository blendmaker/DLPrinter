import { PrinterState } from './../../../../../../../src/printRunner';
import { MessageInterface } from './../../../../../../../src/IpcWsMessages/MessageInterface';
import { WebSocketService } from './../../../services/web-socket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  public state: PrinterState;
  constructor(private ws: WebSocketService) { }

  ngOnInit() {
    this.ws.subscribe( data => {
      switch (data.cmd) {
        case 'state' : this.state = data.data; break;
      }
    });
  }
}
