import cors from 'cors';
import Express from 'express';
import { createServer } from 'http';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { User } from '@chat/shared';

import { handleSockets } from './ws';

const app = Express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3005",
    methods: ["GET", "POST"],
  },
});
const USERSSOCKETS: Socket[] = [];
const USERS: User[] = [];
const PORT = process.env.PORT || 4005;

app.use(cors());

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

http.listen(PORT, () => {
  console.log(`listening on http://localhost:4005`);
});
