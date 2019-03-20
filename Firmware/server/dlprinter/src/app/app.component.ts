import { DisconnectedDisplayComponent } from './components/ui/disconnected-display/disconnected-display.component';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private modalRef: NgbModalRef;

  constructor (
    private modal: NgbModal,
    private ws: WebSocketService
  ) {
    this.ws.connected.subscribe( connected => {
      if (connected) {
        if (this.modalRef) {
          this.modalRef.close();
          this.modalRef = null;
        }
      } else {
        if (! this.modalRef) {
          this.modalRef = this.modal.open(DisconnectedDisplayComponent, {
            backdrop: 'static',
            keyboard: false,
            centered: true,
          });
        }
      }
    });
  }
}
