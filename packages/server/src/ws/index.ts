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
  handleDisConnection(options);
  handleMessagesToUser(options);
  handleTyping(options);
  handleStopTyping(options);
}

function handleJoins(options: HandleSocketsProps) {
  const { socket, server, users } = options;
  socket.on("join", (name: string) => {
    users.push({ name, uuid: socket.id });
    server.to(socket.id).emit("accountCreated", { name, uuid: socket.id });
    server.emit("allUsers", users);
  });
}

function handleMessagesToUser(options: HandleSocketsProps) {
  const { server, socket, users } = options;
  socket.on("sendMessageToUser", (msg: Message, id: string) => {
    if (!users.find((u) => u.uuid === id)) return;
    server
      .to(id)
      .to(socket.id)
      .emit("recieveMessage", {
        ...msg,
        from: socket.id,
        to: id,
        type: "message",
        time: new Date(),
      });
  });
}

function handleDisConnection(options: HandleSocketsProps) {
  const { socket, users, usersSockets } = options;
  socket.on("disconnect", () => {
    const index = users.findIndex((u) => u.uuid === socket.id);
    if (index >= 0) {
      socket.broadcast.emit("userLeft", {
        sender: users[index].name,
        from: socket.id,
        to: "all",
        type: "disconnect",
        ...defaultMessage(),
      });
      const i = usersSockets.indexOf(socket);
      usersSockets.splice(i, 1);
      users.splice(index, 1);
      socket.broadcast.emit("allUsers", users);
    }
  });
}

function handleTyping(options: HandleSocketsProps) {
  const { server, socket, users } = options;
  socket.on("typing", (id: string) => {
    const sender = users.find((u) => u.uuid === socket.id)?.name;
    const receiver = users.find((u) => u.uuid === id)?.uuid;
    if (!receiver || !sender) return;
    server.to(id).emit("userTyping", socket.id);
  });
}

function handleStopTyping(options: HandleSocketsProps) {
  const { server, socket, users } = options;
  socket.on("stoppedTyping", (id: string) => {
    const sender = users.find((u) => u.uuid === socket.id)?.name;
    const receiver = users.find((u) => u.uuid === id)?.uuid;
    if (!receiver || !sender) return;
    server.to(id).emit("userStoppedTyping", socket.id);
  });
}
