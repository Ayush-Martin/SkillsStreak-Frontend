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

export interface IChat {
  _id: string;
  chatType: "group" | "individual";
  course: {
    _id: string;
    icon: string;
    title: string;
  };
  otherMember: {
    _id: string;
    icon: string;
    username: string;
  };
  lastMessage: string;
}

export interface IChatMessage {
  chatId: string;
  _id: string;
  sender: {
    _id: string;
    username: string;
    profileImage: string;
  };
  message: string;
  messageType: "text" | "image";
  createdAt: string;
}
