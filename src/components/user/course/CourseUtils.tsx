import { Notebook, Send } from "lucide-react";
import { FC, useContext, useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { Input } from "../../ui/input";
import { ScrollArea, Button } from "@/components";
import { useScrollToBottom } from "@/hooks";
import { Mosaic } from "react-loading-indicators";
import ViewCourseContext from "@/context/ViewCourseContext";
import { INotebook } from "@/types/notebookType";
import { IoMdAdd, IoMdCreate, IoMdTrash } from "react-icons/io";

interface ICourseUtilityProps {
  isCourseUtilsOpen: boolean;
  toggleCourseUtilsOpen: () => void;
}

const sharedBoxStyles =
  "fixed bottom-20 right-5 max-w-sm w-full h-[520px] rounded-2xl shadow-2xl bg-gradient-to-br from-[#1a1d25]/80 to-[#0e1015]/90 backdrop-blur-xl border border-white/10 text-white flex flex-col z-50 overflow-hidden";

const sharedHeaderStyles =
  "flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 text-white text-sm font-semibold";

const CourseUtility: FC<ICourseUtilityProps> = ({
  isCourseUtilsOpen,
  toggleCourseUtilsOpen,
}) => {
  const [currentOpen, setCurrentOpen] = useState<"notebook" | "ai" | "none">(
    "none"
  );

  const toggle = () => {
    if (isCourseUtilsOpen) setCurrentOpen("none");
    toggleCourseUtilsOpen();
  };

  return (
    <>
      {currentOpen === "ai" && (
        <AiChat onClose={() => setCurrentOpen("none")} />
      )}
      {currentOpen === "notebook" && <NotebookContainer />}

      <div className="fixed bottom-5 right-5 z-50 py-2 px-4 rounded-full backdrop-blur-md bg-[#1a1d25]/80 border border-white/20 shadow-lg flex gap-3 items-center text-white">
        {isCourseUtilsOpen && (
          <>
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-xl"
              onClick={() =>
                setCurrentOpen(currentOpen === "notebook" ? "none" : "notebook")
              }
            >
              <Notebook />
            </button>
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-xl"
              onClick={() =>
                setCurrentOpen(currentOpen === "ai" ? "none" : "ai")
              }
            >
              <FaRobot />
            </button>
          </>
        )}
        <button
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-xl"
          onClick={toggle}
        >
          {isCourseUtilsOpen ? <LuPanelLeftOpen /> : <LuPanelRightOpen />}
        </button>
      </div>
    </>
  );
};

// ---------------- AI Chat ----------------
interface IAiChatProps {
  onClose: () => void;
}

const AiChat: FC<IAiChatProps> = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const { aiChats, sendAiChatMessage } = useContext(ViewCourseContext)!;
  const chatEndRef = useScrollToBottom([aiChats]);

  const sendMessage = () => {
    if (!message.trim()) return;
    sendAiChatMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={sharedBoxStyles}>
      <div className={sharedHeaderStyles}>
        <h2 className="text-lg font-bold">AI Course Assistant</h2>
        <button
          onClick={onClose}
          className="hover:text-red-400 transition-all duration-300"
        >
          <IoClose size={20} />
        </button>
      </div>

      <ScrollArea className="flex-1 px-4 py-3 space-y-3">
        {aiChats.chats.slice(1).map((chat, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap transition-all duration-300 ${
              chat.role === "model"
                ? "bg-white/10 self-start animate-fade-in"
                : "bg-blue-600 self-end text-white ml-auto animate-fade-in"
            }`}
          >
            {chat.parts[0].text}
          </div>
        ))}
        {aiChats.loading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl w-fit my-3 animate-pulse">
            <Mosaic
              color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
              size="small"
            />
            <p className="text-sm font-mono">Thinking...</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </ScrollArea>

      <div className="border-t border-white/10 bg-white/5 px-4 py-3 flex gap-2">
        <Input
          placeholder="Ask something..."
          className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm rounded-xl focus:ring-1 focus:ring-blue-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="text-white hover:text-blue-400 transition-all duration-300 p-2 rounded-lg bg-blue-700/30 hover:bg-blue-700/50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// ---------------- Notebook ----------------
const NotebookContainer: FC = () => {
  const [newTitle, setNewTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  const {
    notebooks,
    addNotebook,
    updateNotebook,
    deleteNotebook,
    fetchNotebooks,
  } = useContext(ViewCourseContext)!;

  useEffect(() => {
    if (!notebooks.length) fetchNotebooks();
  }, []);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addNotebook(newTitle.trim());
    setNewTitle("");
    setShowInput(false);
  };

  return (
    <div className={sharedBoxStyles}>
      <div className={sharedHeaderStyles}>
        <h2 className="text-lg font-bold">Course Notebooks</h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowInput(!showInput)}
          className="hover:bg-white/10 rounded-lg p-1 transition-all"
        >
          <IoMdAdd className="text-xl" />
        </Button>
      </div>

      {showInput && (
        <div className="px-4 py-2 flex gap-2">
          <Input
            className="bg-white/10 border border-white/20 placeholder:text-white/40 text-white rounded-lg"
            placeholder="Notebook Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button size="sm" onClick={handleAdd} className="transition-all">
            Save
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1 px-4 py-3 space-y-3">
        {notebooks.map((notebook) => (
          <NotebookItem
            key={notebook._id}
            {...notebook}
            deleteNotebook={deleteNotebook}
            updateNotebook={updateNotebook}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

interface NotebookItemProps extends INotebook {
  deleteNotebook: (id: string) => void;
  updateNotebook: (id: string, title: string, notes: string[]) => void;
}

const NotebookItem: FC<NotebookItemProps> = ({
  _id,
  title,
  notes,
  deleteNotebook,
  updateNotebook,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newNote, setNewNote] = useState("");

  const saveTitle = () => {
    if (newTitle.trim()) updateNotebook(_id, newTitle.trim(), notes);
    setEditingTitle(false);
  };

  const addNote = () => {
    if (newNote.trim()) {
      updateNotebook(_id, title, [...notes, newNote.trim()]);
      setNewNote("");
    }
  };

  const deleteNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    updateNotebook(_id, title, updated);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-2 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center gap-2">
        {editingTitle ? (
          <>
            <Input
              className="bg-white/10 text-white border border-white/20 rounded-lg"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button size="sm" onClick={saveTitle} className="transition-all">
              Save
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm font-medium flex-1 truncate">{title}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingTitle(true)}
              className="hover:text-purple-400 transition-all"
            >
              <IoMdCreate />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-500 transition-all"
              onClick={() => deleteNotebook(_id)}
            >
              <IoMdTrash />
            </Button>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          className="bg-white/10 text-white border border-white/20 rounded-lg"
          placeholder="Add note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button size="sm" onClick={addNote} className="transition-all">
          <IoMdAdd />
        </Button>
      </div>

      {notes.length > 0 && (
        <div className="space-y-2 text-sm text-white/80 max-h-36 overflow-y-auto">
          {notes.map((note, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/5 border border-white/10 px-3 py-1 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <p className="truncate">{note}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-500 transition-all"
                onClick={() => deleteNote(i)}
              >
                <IoMdTrash />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseUtility;
