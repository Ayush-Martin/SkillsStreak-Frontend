import io from "socket.io-client";
import { Socket } from "socket.io-client";
import store from "@/store";
import { BACKEND_BASE_URL } from "@/constants/API";
import { SocketEvents } from "@/constants/socketEvents";

let socket: typeof Socket;

export const connectSocket = () => {
  try {
    const { accessToken } = store.getState().user;

    if (accessToken) {
      if (socket) {
        socket.disconnect();
      }

      socket = io(BACKEND_BASE_URL, {
        auth: {
          token: accessToken,
        },
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socket.on(SocketEvents.CONNECT_ERROR, (err: Error) => {
        console.error("Socket connection error:", err.message);
      });

      socket.on("message", (data: string) => {
        console.log(data);
      });

      socket.on(SocketEvents.CONNECT, () => {
        console.log("Socket connected successfully with ID:", socket.id);
      });

      socket.on(SocketEvents.DISCONNECT, (reason: string) => {
        console.log("Socket disconnected:", reason);
      });

      return socket;
    }
  } catch (error) {
    console.error("Error setting up socket connection:", error);
  }

  return null;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket is not initialized. Call connectSocket() first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected manually");
  }
};
