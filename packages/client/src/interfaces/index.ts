export interface MessageProps {
  sender: string;
  message: string;
  uuid?: string;
  sameUser?: boolean;
  time?: Date;
  type?: 'disconnect' | 'typing' | 'message' | 'join';
}
