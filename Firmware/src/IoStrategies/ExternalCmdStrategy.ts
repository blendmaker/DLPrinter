import { IoStrategy } from "../Interfaces/IoStrategy";

export class ExternalCmdStrategy implements IoStrategy {
    name = 'Run external binary';
    description = 'With this setting you may select an external binary which does the movement.';
}