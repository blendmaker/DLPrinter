import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FileMeta } from '../../../../../../../src/Interfaces/FileMeta';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent {
  @Input() data: FileMeta[];
  @Output() process = new EventEmitter();
  @Output() inspect = new EventEmitter();
  @Output() delete = new EventEmitter();
}
