import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageInterface } from '../../../../../src/IpcWsMessages/MessageInterface';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends BehaviorSubject<MessageInterface> {
  private wsUrl = environment.wsUrl;
  private ws: WebSocket;
  private data: MessageInterface;
  public connected: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // private connectionListener: (() => void)[] = [];

  constructor() {
    super({ cmd : '' });
    this.connect();
  }

  public send(message: MessageInterface | string) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    if (this.connect()) {
      // this.connected.next(true);
      /*while (this.connectionListener.length > 0) {
        const fn = this.connectionListener[0];
        this.connectionListener.shift();
        fn();
      }*/
      this.ws.send(message);
      return true;
    }
    // this.connected.next(false);
    return false;
  }

  /*public waitForConnection(listener: () => void) {
    // connection open? if not, try to connect
    if (this.ws && this.ws.readyState === this.ws.OPEN || this.connect()) {
      listener();
    } else {
      this.connectionListener.push(listener);
    }
  }*/

  public getValue() {
    return this.data;
  }

  private connect(): boolean {
    if (! this.ws || this.ws.readyState !== this.ws.OPEN) {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onmessage = (event: MessageEvent) => {
        this.data = JSON.parse(event.data);
        this.next(this.data);
      };
    }
    this.connected.next(this.ws.readyState === this.ws.OPEN);
    return this.connected.value;
  }
}
