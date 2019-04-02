import { IoStrategy } from "../interfaces/IoStrategy";

export class SerialStrategy implements IoStrategy {
    name = 'Send serial command';
    description = 'With this setting you may send serial messages. Use this for communication to Arduinos and alikes.';


}