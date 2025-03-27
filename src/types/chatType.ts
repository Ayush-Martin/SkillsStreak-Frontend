export interface IPremiumMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType: "text" | "image";
  chatId: string;
  createdAt: string;
}

export interface IPremiumChat {
  _id: string;
  userId: string;
  trainerId: string;
  lastMessage: {
    message: string;
    createdAt: string;
    messageType: "text" | "image";
  };
  name: string;
}
