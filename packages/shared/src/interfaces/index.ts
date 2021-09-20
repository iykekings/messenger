export interface User {
  uuid: string;
  name: string;
}

export interface ClientEventMaps {
  sendMessageToUser: (mgs: Message, to: string) => void;
  join: (name: string) => void;
  typing: (id: string) => void;
  stoppedTyping: (id: string) => void;
}
export interface ServerEventMaps {
  recieveMessage: (msg: ServerMessage) => void;
  newUser: (user: User) => void;
  accountCreated: (user: User) => void;
  allUsers: (users: User[]) => void;
  userLeft: (user: ServerMessage) => void;
  userTyping: (chatId: string) => void;
  userStoppedTyping: (chatId: string) => void;
}
export interface AllEventMaps extends ServerEventMaps, ClientEventMaps {}

export interface Message {
  sender: string;
  message: string;
}
export interface ServerMessage extends Message {
  time: Date;
  to: string;
  from: string;
  type: "disconnect" | "message" | "join" | "left";
}

export function defaultMessage(): Pick<ServerMessage, "message" | "time"> {
  return {
    message: "",
    time: new Date(),
  };
}
