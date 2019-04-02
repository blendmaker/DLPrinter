export interface Message {
    cmd: '' | 
        'color' | 'text' | 'heartbeat' |
        'get-settings' | 'set-settings' | 'reset-settings' |
        'get-files' | 'delete-file' | 'file-upload' |
        'layer' | 'center' | 'state' | 'light'
    ;
    data?: any;
}
