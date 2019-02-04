import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageInterface } from '../../../../../src/IpcWsMessages/MessageInterface';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends BehaviorSubject<any> {
  private wsUrl = environment.wsUrl;
  private ws: WebSocket;
  private status: any;
  private timeout = 1000;

  constructor() {
    super({});
    this.connect();
  }

  public send(message: MessageInterface | string) {
    console.log(message.cmd);
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    if (this.connect()) {
      this.ws.send(message);
      return true;
    }
    return false;
  }

  /*public next(message: MessageInterface|any) {

  }*/

  public getValue() {
    return this.status;
  }

  private connect(): boolean {
    if (! this.ws || this.ws.readyState !== this.ws.OPEN) {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onmessage = (event: MessageEvent) => {
        this.next(event.data);
      };
    }
    return this.ws.readyState === this.ws.OPEN;
  }
}
