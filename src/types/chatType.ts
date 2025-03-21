export interface IPremiumMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType: "text" | "image";
  chatId: string;
}

export interface IPremiumChat {
  _id: string;
  userId: string;
  trainerId: string;
  lastMessage: string;
  name: string;
}
