export interface User {
  uuid: string;
  name: string;
}

export interface ClientEventMaps {
  sendMessage: (msg: Message) => void;
  joinChat: (chatId: string) => void;
  join: (name: string) => void;
  typing: (id: string) => void;
  stoppedTyping: (id: string) => void;
}
export interface ServerEventMaps {
  recieveMessage: (msg: ServerMessage) => void;
  newUser: (user: ServerMessage) => void;
  allUsers: (users: User[]) => void;
  userLeft: (user: ServerMessage) => void;
}
export interface AllEventMaps extends ServerEventMaps, ClientEventMaps {}

export interface Message {
  sender: string;
  message: string;
}
export interface ServerMessage extends Message {
  uuid: string;
  time: Date;
  type:
    | "disconnect"
    | "typing"
    | "message"
    | "join"
    | "left"
    | "stopped-typing";
  sameUser: boolean;
}

export function defaultMessage(): Pick<
  ServerMessage,
  "message" | "time" | "sameUser"
> {
  return {
    message: "",
    time: new Date(),
    sameUser: false,
  };
}
