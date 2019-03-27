import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageInterface } from '../../../../../src/interfaces/MessageInterface';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends BehaviorSubject<MessageInterface> {
  private wsUrl = environment.wsUrl;
  private ws: WebSocket;
  private data: MessageInterface;
  public connected: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    super({ cmd : '' });
    this.connect();
  }

  public send(message: MessageInterface | string) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    if (this.connect()) {
      this.ws.send(message);
      return true;
    }
    return false;
  }

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
