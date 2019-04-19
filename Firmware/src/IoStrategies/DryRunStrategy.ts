import { IoStrategy } from "../Interfaces/IoStrategy";

export class DryRunStrategy implements IoStrategy {
  name = 'Dry run';
  description = 'This strategy won\'t do any work. It will just delay the print process for the duration of movements';
}