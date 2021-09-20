import type {
  Server,
  Socket,
} from 'socket.io';

import {
  ClientEventMaps,
  defaultMessage,
  Message,
  ServerEventMaps,
  User,
} from '@chat/shared';

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
  handleJoinChat(options);
}

function handleJoins(options: HandleSocketsProps) {
  const { socket, server, users } = options;
  socket.on("join", (name: string) => {
    users.push({ name, uuid: socket.id });
    server.to(socket.id).emit("allUsers", users);
  });
}

function handleJoinChat(options: HandleSocketsProps) {
  const { socket, server, users } = options;
  socket.on("joinChat", (chatId: string) => {
    const name = users.find((u) => u.uuid === socket.id)?.name!;
    if (!users.find((u) => u.uuid === chatId) && !name) return;
    socket.join(chatId);
    server.to(chatId).emit("newUser", {
      sender: name,
      uuid: socket.id,
      type: "join",
      ...defaultMessage(),
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
    const index = users.findIndex((u) => u.uuid === socket.id);
    if (index >= 0) {
      server.to(socket.id).emit("userLeft", {
        sender: users[index].name,
        uuid: socket.id,
        type: "disconnect",
        ...defaultMessage(),
      });
      const i = usersSockets.indexOf(socket);
      usersSockets.splice(i, 1);
      users.splice(index, 1);
    }
  });
}