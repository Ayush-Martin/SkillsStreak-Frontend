import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { getSocket } from "@/config/socket";
import { SocketEvents } from "@/constants";
import { RootReducer } from "@/store";
import {
  IChat,
  IChatMessage,
  IChatMessageReaction,
  IChatMessageReactionEmoji,
} from "@/types/chatType";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const useChat = () => {
  const [chats, setChats] = useState<Array<IChat>>([]);
  const [trainers, setTrainers] = useState<
    Array<{ _id: string; username: string }>
  >([]);
  const socket = getSocket();
  const [selectedChat, setSelectedChat] = useState<{
    _id: string;
    icon: string;
    title: string;
    type: "group" | "individual";
  } | null>(null);
  const { _id } = useSelector((state: RootReducer) => state.user);
  const messageHandlerRef = useRef<(msg: IChatMessage) => void>(null);
  const reactionHandlerRef =
    useRef<(msgId: string, reactions: IChatMessageReaction[]) => void>(null);

  useEffect(() => {
    const fetchChat = async () => {
      const res = await axiosGetRequest("/chats");
      if (!res) return;
      setChats(res.data);
    };

    const fetchTrainers = async () => {
      const res = await axiosGetRequest(`/trainers`);
      if (!res) return;
      const data = res.data as Array<{ _id: string; username: string }>;
      setTrainers(data.filter((x) => x._id != _id));
    };

    fetchChat();
    fetchTrainers();
  }, []);

  useEffect(() => {
    socket.on(SocketEvents.CHAT_JOIN, (chat: IChat) => {
      setChats((p) => [...p, chat]);
    });

    socket.on(
      SocketEvents.CHAT_LAST_MESSAGE,
      ({
        chatId,
        lastMessage,
        lastMessageTime,
      }: {
        lastMessage: string;
        chatId: string;
        lastMessageTime: string;
      }) => {
        setChats((prevChats) => {
          const chat = prevChats.find((chat) => chat._id === chatId);
          if (!chat) return prevChats;

          const updatedChat = {
            ...chat,
            lastMessage,
            lastMessageTime,
          };

          // Move updated chat to the top
          const newChats = [
            updatedChat,
            ...prevChats.filter((chat) => chat._id !== chatId),
          ];

          return newChats;
        });
      }
    );

    return () => {
      socket.off(SocketEvents.CHAT_JOIN);
      socket.off(SocketEvents.CHAT_LAST_MESSAGE);
    };
  }, []);

  useEffect(() => {
    socket.on(SocketEvents.CHAT_MESSAGE_BROADCAST, (message: IChatMessage) => {
      if (
        !messageHandlerRef.current ||
        !selectedChat?._id ||
        message.chatId != selectedChat._id
      )
        return;
      messageHandlerRef.current(message);
    });

    socket.on(
      SocketEvents.CHAT_MESSAGE_REACTION_BROADCAST,
      (data: {
        chatId: string;
        messageId: string;
        reactions: IChatMessageReaction[];
      }) => {
        if (
          !reactionHandlerRef.current ||
          !selectedChat?._id ||
          data.chatId != selectedChat._id
        )
          return;
        reactionHandlerRef.current(data.messageId, data.reactions);
      }
    );

    return () => {
      socket.off(SocketEvents.CHAT_MESSAGE_BROADCAST);
      socket.off(SocketEvents.CHAT_MESSAGE_REACTION_BROADCAST);
    };
  }, [selectedChat]);

  const selectChat = (
    _id: string,
    icon: string,
    title: string,
    type?: "group" | "individual"
  ) => {
    setSelectedChat({ _id, icon, title, type: type || "individual" });
  };

  const fetchMessages = async (
    handler: (messages: Array<IChatMessage>) => void
  ) => {
    const res = await axiosGetRequest(`/chats/${selectedChat?._id}`);
    if (!res) return;
    handler(res.data);
  };

  const sendMessage = (message: string, type?: "text" | "image" | "emoji") => {
    if (!selectedChat || !socket) return;
    socket.emit(SocketEvents.CHAT_MESSAGE_SEND, {
      chatId: selectedChat._id,
      message: message,
      type,
    });
  };

  const sendReaction = (
    messageId: string,
    emoji: IChatMessageReactionEmoji
  ) => {
    if (!selectedChat || !socket) return;
    socket.emit(SocketEvents.CHAT_MESSAGE_REACTION_SEND, {
      chatId: selectedChat._id,
      messageId,
      emoji,
    });
  };

  const sendMedia = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    await axiosPostRequest(`/chats/${selectedChat?._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const newChat = async (trainerId: string) => {
    const chat = chats.find(
      (chat) =>
        chat.otherMember._id == trainerId && chat.chatType == "individual"
    );
    if (chat) {
      selectChat(chat._id, chat.otherMember.icon, chat.otherMember.username);
      return;
    }
    const res = await axiosGetRequest(`/chats/new/${trainerId}`);
    if (!res) return;
    setChats([...chats, res.data]);
    selectChat(
      res.data._id,
      res.data.otherMember.icon,
      res.data.otherMember.username
    );
  };

  const getChatMembers = async () => {
    const res = await axiosGetRequest(`/chats/${selectedChat?._id}/members`);
    if (!res) return [];
    return res.data as Array<{
      _id: string;
      profileImage: string;
      username: string;
      isAdmin: boolean;
    }>;
  };

  const registerMessageHandlers = ({
    newMessageHandler,
    newReactionHandler,
  }: {
    newMessageHandler: (message: IChatMessage) => void;
    newReactionHandler: (
      messageId: string,
      reactions: IChatMessageReaction[]
    ) => void;
  }) => {
    messageHandlerRef.current = newMessageHandler;
    reactionHandlerRef.current = newReactionHandler;
  };

  return {
    selectChat,
    fetchMessages,
    sendMedia,
    sendMessage,
    sendReaction,
    chats,
    trainers,
    selectedChat,
    newChat,
    registerMessageHandlers,
    getChatMembers,
  };
};

export default useChat;
