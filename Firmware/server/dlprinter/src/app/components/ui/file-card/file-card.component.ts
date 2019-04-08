import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileMeta } from '../../../../../../../src/Interfaces/FileMeta';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent {
  @Input() data: FileMeta;
  @Output() process = new EventEmitter();
  @Output() inspect = new EventEmitter();
  @Output() delete = new EventEmitter();
}
