import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileMeta } from '../../../../../../../src/interfaces/FileMeta';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent {
  @Input() data: FileMeta;
  @Output() print = new EventEmitter();
  @Output() inspect = new EventEmitter();
  @Output() delete = new EventEmitter();
}
