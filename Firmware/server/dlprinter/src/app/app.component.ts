import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dlprinter';
  // ws: WebSocket;

  ngOnInit(): void {
    // this.ws = new WebSocket('ws://' + window.location.host);
  }
}
