import {
  IChat,
  IChatMessage,
  IChatMessageReaction,
  IChatMessageReactionEmoji,
} from "@/types/chatType";
import { createContext } from "react";

interface RegisterMessageHandlers {
  newMessageHandler: (message: IChatMessage) => void;
  newReactionHandler: (
    messageId: string,
    reactions: IChatMessageReaction[]
  ) => void;
}

interface IChatContext {
  chats: Array<IChat>;
  trainers: Array<{ _id: string; username: string }>;
  selectedChat: {
    _id: string;
    icon: string;
    title: string;
    type: "group" | "individual";
  } | null;
  selectChat: (
    _id: string,
    icon: string,
    title: string,
    type?: "group" | "individual"
  ) => void;
  fetchMessages: (handler: (messages: Array<IChatMessage>) => void) => void;
  sendMessage: (message: string, type?: "text" | "emoji") => void;
  sendReaction: (messageId: string, emoji: IChatMessageReactionEmoji) => void;
  sendMedia: (file: File) => void;
  newChat: (trainerId: string) => void;
  registerMessageHandlers: (handlers: RegisterMessageHandlers) => void;
  getChatMembers: () => Promise<
    Array<{
      _id: string;
      profileImage: string;
      username: string;
      isAdmin: boolean;
    }>
  >;
}

const chatContext = createContext<IChatContext | undefined>(undefined);

export default chatContext;
