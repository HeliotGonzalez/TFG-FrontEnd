export interface Message {
  id?: number;
  from: number;
  to: number;
  text: string;
  ts: number;
  read: number;
}

export interface ConvSnapshot { 
  userId: number;
  messages: Message[];
}

export interface UserToMessage extends Message {
  from: number;
  to: number;
  text: string;
  ts: number;
}