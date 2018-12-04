export interface MessageInterface {
    cmd: '' | 'color' | 'layer' | 'get-settings' | 'set-settings' | 'text' | 'heartbeat' | 'center' ;
    data: any;
}