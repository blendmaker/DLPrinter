export interface MessageInterface {
    cmd: '' | 
        'color' | 'get-settings' | 'set-settings' | 'text' | 'heartbeat' | 
        'layer' | 'center' | 'state'
    ;
    data: any;
}