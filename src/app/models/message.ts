export interface Message {
  from: number;
  to: number;
  text: string;
  ts: number;
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