import { SettingsData } from './../../../../../../../src/interfaces/SettingsData';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  protected form: FormGroup = new FormGroup({
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
    security: new FormControl(false),
  });
  private subscription: Subscription[] = [];

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.subscription.push(this.settingsService.getSettingsData().subscribe( data => {
      this.settingsToControls(data);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe() );
    this.subscription = [];
  }

  protected resetSettings($event: Event) {
    $event.preventDefault();
    this.settingsService.resetSettingsData();
  }

  protected sendSettings($event: Event) {
    $event.preventDefault();

    // TODO handle slicer settings
    this.subscription.push(this.settingsService.getSettingsData().pipe( first() ).subscribe( data => {
      for (const key in this.form.controls) {
        if (this.form.controls.hasOwnProperty(key)) {
            data[key] = this.form.controls[key].value;
        }
      }
      this.settingsService.setSettingsData(data);
    } ));
  }

  private settingsToControls(settingsData: SettingsData) {
    for (const key in settingsData) {
      if (settingsData.hasOwnProperty(key)) {
        if (typeof settingsData[key] !== 'object') {
          this.form.get(key).setValue(settingsData[key]);
        }
      }
    }
    // TODO handle slicer settings
  }
}
