export interface Notification {
    type: 'FRIEND_REQUEST' | 'CHAT' | 'FRIEND_ACCEPTED';
    from: number;
    payload: any;
    extraData: any;
    fromName: String;
}