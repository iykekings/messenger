import {
  createContext,
  h,
} from 'preact';
import { useContext } from 'preact/hooks';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';

const socketConnection = io("ws://localhost:4005");

export const SocketContext = createContext<Socket>(socketConnection);

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
