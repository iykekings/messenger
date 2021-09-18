import Express from 'express';
import { createServer } from 'http';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import {
  ChatType,
  Room,
} from '@chat/shared';

interface Message {
  sender: string;
  message: string;
  time?: Date;
  to?: string;
}

const app = Express();
const http = createServer(app);
const io = new Server(http);
const USERSOCKETS: Socket[] = [];
const ADMINSOCKETS: Socket[] = [];
const USERS: Array<{ name: string; id: string }> = [];

app.get("/", (_req, res) => {
  res.status(200).json({ message: "welcome" });
});

io.on("connection", (socket: Socket) => {
  socket.on(ChatType.ADMIN_JOIN_CONNECTION, (name: string) => {
    ADMINSOCKETS.push(socket);

    socket.join(Room.ADMIN);
    socket.broadcast.to(Room.ADMIN).emit(ChatType.ADMIN_JOIN_CONNECTION, {
      sender: name,
      time: new Date(),
    });

    // Send all users to new admin
    io.to(socket.id).emit(ChatType.GET_ALL_USERS, { users: USERS });

    for (const user of USERS) {
      socket.join(user.id);
    }
  });

  // socket.on(
  //   ChatType.ADMIN_JOIN_CHAT,
  //   ({ id, name }: { id: string; name: string }) => {
  //     socket.broadcast
  //       .to(id)
  //       .emit(ChatType.ADMIN_JOIN_CHAT, { sender: name, time: new Date() });

  //     socket.join(id);

  //     io.to(id).emit(ChatType.SEND_MESSAGE, {
  //       sender: name,
  //       uuid: id,
  //       message: `I am ${name}.\nHow may I help you?`,
  //       time: new Date(),
  //     });
  //   }
  // );

  // socket.on('admin-request-join', (uuid: string) => {
  //   socket.join(uuid);
  // });

  socket.on(ChatType.ADMIN_SEND_MESSAGE, (msg: Message) => {
    if (msg.to) {
      io.to(msg.to).emit(ChatType.SEND_MESSAGE, {
        ...msg,
        uuid: msg.to,
        time: new Date(),
      });
    }
  });

  socket.on(ChatType.USER_JOIN, (name: string) => {
    USERS.push({ name, id: socket.id });
    for (const adminSocket of ADMINSOCKETS) {
      adminSocket.join(socket.id);
    }
    socket.broadcast.to(socket.id).emit(ChatType.USER_JOIN, {
      sender: name,
      time: new Date(),
      uuid: socket.id,
    });
  });

  socket.on(ChatType.SEND_MESSAGE, (msg: Message) => {
    io.to(socket.id).emit(ChatType.SEND_MESSAGE, {
      ...msg,
      uuid: socket.id,
      time: new Date(),
    });
  });

  socket.on("disconnect", () => {
    const index = USERS.findIndex((u) => u.id === socket.id);
    if (index >= 0) {
      io.to(socket.id).emit(ChatType.USER_LEAVE_CHAT, {
        sender: USERS[index].name,
        uuid: socket.id,
        time: new Date(),
      });
      const i = USERSOCKETS.indexOf(socket);
      USERSOCKETS.splice(i, 1);
      USERS.splice(index, 1);
    }
  });
});

http.listen(4005, () => {
  console.log("listening on *:4005");
});
