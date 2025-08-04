import io from "socket.io-client";
import { Socket } from "socket.io-client";
import store from "@/store";
import { BACKEND_BASE_URL } from "@/constants/API";
import { SocketEvents } from "@/constants/socketEvents";

let socket: typeof Socket;

export const connectSocket = () => {
  try {
    const { accessToken } = store.getState().user;
    console.log("inside connect socket");
    if (accessToken) {
      console.log("connection checking access token");
      if (socket) {
        console.log(" socket connected aldready");
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

      console.log(" socket on process to connect", socket);

      // socket.on(SocketEvents., (err: Error) => {
      //   console.warn("Socket connection error:", err.message);
      // });

      socket.on(SocketEvents.CONNECT, () => {
        console.info("Socket connected successfully with ID:", socket.id);
      });

      socket.on(SocketEvents.DISCONNECT, (reason: string) => {
        console.warn("Socket disconnected:", reason);
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
    console.warn("Socket disconnected manually");
  }
};
