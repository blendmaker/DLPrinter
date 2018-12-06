import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { from, of } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { MessageInterface } from '../../../../../../../src/IpcWsMessages/MessageInterface';
import { SettingsData } from '../../../../../../../src/Settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup = new FormGroup({
    port: new FormControl('', [ Validators.required ]),
    phys_width: new FormControl('', [ Validators.required ]),
    phys_height: new FormControl('', [ Validators.required ]),
    endstop_idle_state: new FormControl('', [ Validators.required ]),
    endstop_triggered_state: new FormControl('', [ Validators.required ]),
    max_layer_height: new FormControl('', [ Validators.required ]),
    min_layer_height: new FormControl('', [ Validators.required ]),
    max_burn_time: new FormControl('', [ Validators.required ]),
    min_burn_time: new FormControl('', [ Validators.required ]),
    z_max: new FormControl('', [ Validators.required ]),
    z_min_speed: new FormControl('', [ Validators.required ]),
    z_max_speed: new FormControl('', [ Validators.required ]),
    z_acceleration: new FormControl('', [ Validators.required ]),
    z_steps: new FormControl('', [ Validators.required ]),
    security: new FormControl(true),
  });
  settings: SettingsData;
  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.webSocketService.subscribe((msg: MessageInterface) => {
      switch (msg.cmd) {
        case 'get-settings' :
          this.settingsToControls();
      }
    });
  }

  protected sendSettings() {
    this.controlsToSettings();
  }

  private controlsToSettings() {
    of(this.form.controls).subscribe((ctrl) => {
      console.log(ctrl);
    });
    console.log(this.form.controls);
  }

  private settingsToControls() {

  }
}
