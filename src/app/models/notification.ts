export interface Notification {
  type: 'FRIEND_REQUEST' | 'chat' | 'FRIEND_ACCEPTED';
  from: number;
  fromName: string;
  payload: any;
  extraData: any;
}