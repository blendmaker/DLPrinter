import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class FilesDisplayOptions {
    itemCount = 4;
    displaySvg = true;
    displayStl = true;
    displayOthers = true;
}

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    public filesDisplayOptions: BehaviorSubject<FilesDisplayOptions>; // = new BehaviorSubject( new FilesDisplayOptions() );
    constructor() {
        const filesDisplayOptions = localStorage.getItem('files-display-options');
        this.filesDisplayOptions = new BehaviorSubject(
            !!filesDisplayOptions ?
            JSON.parse(filesDisplayOptions) as FilesDisplayOptions :
            new FilesDisplayOptions()
        );
        localStorage.setItem('files-display-options', JSON.stringify(this.filesDisplayOptions.value) );
        this.filesDisplayOptions.subscribe(
            data => localStorage.setItem('files-display-options', JSON.stringify(data) ));
    }
}