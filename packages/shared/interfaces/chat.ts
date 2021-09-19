export enum ChatType {
  ADMIN_JOIN_CONNECTION = "admin-join",
  ADMIN_JOIN_CHAT = "admin-enter-chat",
  ADMIN_SEND_MESSAGE = "admin-send-message",
  SEND_MESSAGE = "chat-message",
  GET_ALL_USERS = "get-online-users",
  USER_JOIN = "join-chat",
  USER_LEAVE_CHAT = "left-chat",
}

export enum Room {
  ADMIN = "admin",
}

export interface Message {
  sender: string;
  message: string;
  uuid?: string;
  time?: Date;
  type?: "disconnect" | "typing" | "message" | "join";
}
