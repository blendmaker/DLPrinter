import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup = new FormGroup({
    port: new FormControl('', [ Validators.required ]),
    /* phys_width: new FormControl([ Validators.required ]),
    phys_height: new FormControl([ Validators.required ]),
    endstop_idle_state: new FormControl([ Validators.required ]),
    endstop_triggered_state: new FormControl([ Validators.required ]),
    z_max: new FormControl([ Validators.required ]),
    z_min_speed: new FormControl([ Validators.required ]),
    z_max_speed: new FormControl([ Validators.required ]),
    z_acceleration: new FormControl([ Validators.required ]),
    z_steps: new FormControl([ Validators.required ]), */
    security: new FormControl(true),
  });
  constructor() { }

  ngOnInit() {
  }

}
