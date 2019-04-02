import { IoStrategy } from "../interfaces/IoStrategy";

export class GpioStrategy implements IoStrategy {
    name = 'Use GPIOs';
    description = 'Use this setting if you have your stepper driver and lamp connected to your boards GPIO pins.';


}