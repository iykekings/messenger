# Messenger

A messaging application prototype built with sockets, preact and express. Build tools inlcude Swc, lerna, yarn workspace and webpack

To Run:

- Have NodeJS installed (>= v12)
- Have yarn installed with `npm i -g yarn`
- Run `yarn install` to install dependcencies and sync packages
- Run `yarn start`
  - This compiles the shared package in watch mode
  - Starts Websocket/API server at `http://localhost:4005`
  - And finally renders the frontend in watch mode at `http://localhost:3005`
- Open `http://localhost:3005` on yoru browser to view
- You might need to have multiple browser windows opened, to have contacts to chat with.

To build:

- Run `yarn build`

_NOTE: This is a POC and should not be used as seen in prodcution_

Features:

- Realtime messaging between users
- Know when a user leaves the chat/disconnects
- TODO: #1 know when another user is typing
- Frontend under 125KB
- Well typed socket servers and clients on both FE and BE
- Super fast compilation/recompilation times

Screenshot

<img width="901" alt="Screenshot 2021-09-21 at 00 37 03" src="https://user-images.githubusercontent.com/22247592/134092879-18bb3d5b-462d-4afd-9223-3f77e86fcf90.png">
