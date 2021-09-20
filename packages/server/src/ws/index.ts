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
  handleMessagesToUser(options);
  handleTyping(options);
  handleStopTyping(options);
}

function handleJoins(options: HandleSocketsProps) {
  const { socket, server, users } = options;
  socket.on("join", (name: string) => {
    users.push({ name, uuid: socket.id });
    server.emit("allUsers", users);
  });
}

// Not important...used for groups/rooms
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

// Not important, since we don't want to send messages to everyone
//  Maybe for admins
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

function handleMessagesToUser(options: HandleSocketsProps) {
  const { server, socket, users } = options;
  socket.on("sendMessageToUser", (msg: Message, id: string) => {
    if (!users.find((u) => u.uuid === id)) return;
    server.to(id).emit("recieveMessage", {
      ...defaultMessage(),
      ...msg,
      uuid: socket.id,
      type: "message",
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
        uuid: socket.id,
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
