import type {
  Server,
  Socket,
} from 'socket.io';

import {
  ClientEventMaps,
  Message,
  ServerEventMaps,
} from '@chat/shared';

import { User } from '../interface';

interface HandleSocketsProps {
  server: Server<ClientEventMaps, ServerEventMaps>;
  socket: Socket<ClientEventMaps, ServerEventMaps>;
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
  socket.on("joinChat", (name: string) => {
    users.push({ name, id: socket.id });
    // for (const adminSocket of ADMINSOCKETS) {
    //   adminSocket.join(socket.id);
    // }
    socket.broadcast.to(socket.id).emit("newUser", {
      sender: name,
      time: new Date(),
      uuid: socket.id,
      type: "join",
      sameUser: false,
      message: "",
    });
  });
}

function handleMessages(options: HandleSocketsProps) {
  const { server, socket } = options;
  socket.on("sendMessage", (msg: Message) => {
    server.to(socket.id).emit("recieveMessage", {
      ...msg,
      uuid: socket.id,
      time: new Date(),
      type: "message",
      sameUser: msg.sender === socket.id,
    });
  });
}

function handleDisConnection(options: HandleSocketsProps) {
  const { server, socket, users, usersSockets } = options;
  socket.on("disconnect", () => {
    const index = users.findIndex((u) => u.id === socket.id);
    if (index >= 0) {
      server.to(socket.id).emit("userLeft", {
        sender: users[index].name,
        uuid: socket.id,
        time: new Date(),
        type: "disconnect",
        sameUser: false,
        message: "",
      });
      const i = usersSockets.indexOf(socket);
      usersSockets.splice(i, 1);
      users.splice(index, 1);
    }
  });
}
