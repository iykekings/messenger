import type {
  Server,
  Socket,
} from 'socket.io';

import { ChatType } from '@chat/shared';

import {
  Message,
  User,
} from '../interface';

interface HandleSocketsProps {
  server: Server;
  socket: Socket;
  users: User[];
  usersSockets: Socket[];
}

export function handleSockets(options: HandleSocketsProps) {
  handleJoins(options);
  handleMessages(options);
  handleDisConnection(options);
}

function handleJoins(options: HandleSocketsProps) {
  const { socket, users } = options;
  socket.on(ChatType.USER_JOIN, (name: string) => {
    users.push({ name, id: socket.id });
    // for (const adminSocket of ADMINSOCKETS) {
    //   adminSocket.join(socket.id);
    // }
    socket.broadcast.to(socket.id).emit(ChatType.USER_JOIN, {
      sender: name,
      time: new Date(),
      uuid: socket.id,
    });
  });
}

function handleMessages(options: HandleSocketsProps) {
  const { server, socket } = options;
  socket.on(ChatType.SEND_MESSAGE, (msg: Message) => {
    server.to(socket.id).emit(ChatType.SEND_MESSAGE, {
      ...msg,
      uuid: socket.id,
      time: new Date(),
    });
  });
}

function handleDisConnection(options: HandleSocketsProps) {
  const { server, socket, users, usersSockets } = options;
  socket.on("disconnect", () => {
    const index = users.findIndex((u) => u.id === socket.id);
    if (index >= 0) {
      server.to(socket.id).emit(ChatType.USER_LEAVE_CHAT, {
        sender: users[index].name,
        uuid: socket.id,
        time: new Date(),
      });
      const i = usersSockets.indexOf(socket);
      usersSockets.splice(i, 1);
      users.splice(index, 1);
    }
  });
}
