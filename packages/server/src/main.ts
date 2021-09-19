import Express from 'express';
import { createServer } from 'http';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { handleSockets } from './ws';

const app = Express();
const http = createServer(app);
const io = new Server(http);
const USERSSOCKETS: Socket[] = [];
const USERS: Array<{ name: string; id: string }> = [];

app.get("/", (_req, res) => {
  res.status(200).json({ message: "welcome to our chat server" });
});

io.on("connection", (socket: Socket) => {
  handleSockets({
    server: io,
    socket,
    users: USERS,
    usersSockets: USERSSOCKETS,
  });
});

http.listen(4005, () => {
  console.log("listening on *:4005");
});
