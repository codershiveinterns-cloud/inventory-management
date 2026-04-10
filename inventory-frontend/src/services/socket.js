import { io } from "socket.io-client";

export const socketUrl = "/";

export const socket = io(socketUrl, {
  autoConnect: false,
});
