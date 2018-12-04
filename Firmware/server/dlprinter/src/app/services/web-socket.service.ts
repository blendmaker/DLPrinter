import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends BehaviorSubject<any> {
  private wsUrl = environment.wsUrl;
  private ws: WebSocket;
  private status: any;

  constructor() {
    super({});
    this.connect();
  }

  public next(message: string|any): boolean {
    console.log(message);

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
    return this.status;
  }

  private connect(): boolean {
    if (! this.ws || this.ws.readyState !== this.ws.OPEN) {
      this.ws = new WebSocket(this.wsUrl);
    }
    return this.ws.readyState === this.ws.OPEN;
  }
}
