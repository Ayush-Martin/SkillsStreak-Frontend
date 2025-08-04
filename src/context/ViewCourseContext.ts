import { IAiChatMessage } from "@/types/chatType";
import { INotebook } from "@/types/notebookType";
import { createContext } from "react";

interface IViewCourseContext {
  aiChats: {
    chats: IAiChatMessage[];
    loading: boolean;
  };
  fetchWelcomeAiChat: () => Promise<void>;
  sendAiChatMessage: (message: string) => Promise<void>;
  notebooks: INotebook[];
  addNotebook: (title: string) => void;
  deleteNotebook: (notebookId: string) => void;
  updateNotebook: (notebookId: string, title: string, notes: string[]) => void;
  fetchNotebooks: () => void;
}

const ViewCourseContext = createContext<IViewCourseContext | null>(null);

export default ViewCourseContext;
