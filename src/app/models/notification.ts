export interface Notification {
  type: 'FRIEND_REQUEST' | 'chat' | 'FRIEND_ACCEPTED' | 'VIDEO_CORRECTED';
  from: number;
  fromName: string;
  payload: any;
  extraData: any;
}