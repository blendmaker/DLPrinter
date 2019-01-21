export interface MessageInterface {
    cmd: '' | 
        'color' | 'get-settings' | 'set-settings' | 'text' | 'heartbeat' | 
        'layer' | 'center' | 'state' | 'light'
    ;
    data?: any;
}