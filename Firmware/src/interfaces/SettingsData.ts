export interface SettingsData {
  port: number;
  phys_width: number;
  phys_height: number;
  endstop_idle_state: string|number;
  endstop_triggered_state: string|number;
  max_layer_height: number,
  min_layer_height: number,
  max_burn_time: number,
  min_burn_time: number,
  slicers : [
      { name : string, path : string, }],
  z_max: number;
  z_min_speed: number;
  z_max_speed: number;
  z_acceleration: number;
  z_steps: number;
  security: boolean;
}
