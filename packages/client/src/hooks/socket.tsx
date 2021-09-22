import {
  createContext,
  h,
} from 'preact';
import {
  useContext,
  useEffect,
  useState,
} from 'preact/hooks';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';

import {
  ClientEventMaps,
  Message,
  ServerEventMaps,
  ServerMessage,
  User,
} from '@chat/shared';

const socket: Socket<ServerEventMaps, ClientEventMaps> = io(
  "ws://localhost:4005"
);

interface ISocketContext {
  users: User[];
  auth: User;
  usersTyping: Record<string, boolean>;
  messages: ServerMessage[];
  join: (name: string) => void;
  typing: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  sendMessageToUser: (msg: Message, to: string) => void;
}

export const SocketContext = createContext<ISocketContext>({
  users: [],
  usersTyping: {},
  auth: { uuid: "", name: "" },
  messages: [],
  join: () => {},
  typing: () => {},
  stopTyping: () => {},
  sendMessageToUser: () => {},
});

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [auth, setAuth] = useState<User>({ uuid: "", name: "" });
  const [usersTyping, setUsersTyping] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<ServerMessage[]>([]);

  const value = {
    users,
    auth,
    messages,
    usersTyping,
    join: (name: string) => {
      socket.emit("join", name);
    },
    typing: (chatId: string) => {
      socket.emit("typing", chatId);
    },
    stopTyping: (chatId: string) => {
      socket.emit("stoppedTyping", chatId);
    },
    sendMessageToUser: (msg: Message, to: string) => {
      socket.emit("sendMessageToUser", msg, to);
    },
  };

  useEffect(() => {
    socket.on("allUsers", (newUsers) => setUsers(newUsers));
    socket.on("recieveMessage", (msg) =>
      setMessages((preMsgs) => [...preMsgs, msg])
    );
    socket.on("accountCreated", (user) => setAuth(user));
    socket.on("userTyping", (id) => {
      setUsersTyping((pre) => {
        pre[id] = true;
        return { ...pre };
      });
    });
    socket.on("userStoppedTyping", (id) => {
      setUsersTyping((pre) => {
        pre[id] = false;
        return { ...pre };
      });
    });
    socket.on("userLeft", (msg) => setMessages((preMsgs) => [...preMsgs, msg]));
  }, []);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
