import { Badge, ScrollArea } from "@/components/ui";

import {
  BiSolidMessageSquareAdd,
  IoMdSearch,
  FaLock,
} from "@/assets/icons/icons";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSubscription } from "@/hooks";
import { ProfileImage } from "../common";
import chatContext from "@/context/ChatContext";

interface IChatSidebarProps {
  isOpen: boolean;
}

interface IChatProps {
  icon: string;
  title: string;
  _id: string;
  selected: boolean;
  lastMessage: string;
  lastMessageTime: string;
  chatType: "group" | "individual";
}

const ChatSidebar: FC<IChatSidebarProps> = ({ isOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { newChat, chats, selectedChat } = useContext(chatContext)!;

  useEffect(() => {
    if (chats.length && searchParams.has("trainerId")) {
      newChat(searchParams.get("trainerId")!);
      setSearchParams();
    }
  }, [searchParams, chats]);

  return (
    <div
      className={`w-[270px] flex-shrink-0 h-full border-r  border-app-border  flex-col ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="w-full h-[70px] border-b border-app-border flex items-center justify-center px-3 py-3 relative">
        <SearchTrainers />
      </div>

      <ScrollArea className=" px-5 py-3">
        {chats.map((chat) => (
          <Chat
            lastMessageTime={chat.lastMessageTime}
            key={chat._id}
            _id={chat._id}
            lastMessage={chat.lastMessage}
            icon={
              chat.chatType == "group"
                ? chat.course.icon
                : chat.otherMember.icon
            }
            title={
              chat.chatType == "group"
                ? chat.course.title
                : chat.otherMember.username
            }
            selected={!!selectedChat && selectedChat._id === chat._id}
            chatType={chat.chatType}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

const SearchTrainers: FC = () => {
  const navigate = useNavigate();
  const { newChat, trainers } = useContext(chatContext)!;
  const [search, setSearch] = useState("");
  const { subscriptionDetail } = useSubscription();

  const newIndividualChat = async (trainerId: string) => {
    newChat(trainerId);
    setSearch("");
  };

  return (
    <div className="relative">
      {!subscriptionDetail?.active && (
        <div className="absolute top-0 bottom-0 left-0 right-0 rounded-md w-full h-full bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <button
            onClick={() => navigate("/subscriptionPlans")}
            className="flex gap-1 items-center text-app-accent"
          >
            <FaLock className="text-2xl mr-2" />
            Subscribe
          </button>
        </div>
      )}
      <div className="bg-transparent border border-app-border w-full h-full rounded-lg flex p-2 ">
        <input
          type="text"
          className="bg-transparent w-full h-full focus:outline-none focus:ring-0"
          value={search}
          placeholder="search trainers"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="w-7 h-full flex justify-center items-center text-xl">
          <IoMdSearch />
        </button>
      </div>
      {search && (
        <div className="absolute z-50 left-0 right-0 mx-2 top-16 opacity-90 min-h-10 border rounded-md bg-app-primary border-app-border flex px-5 py-2 flex-col gap-3 ">
          {trainers.length ? (
            trainers
              .filter((trainer) =>
                trainer.username.toLowerCase().includes(search.toLowerCase())
              )
              .map((trainer) => (
                <div className="w-full h-10 flex justify-between items-center gap-2 border-b border-app-border">
                  <p className="">{trainer.username}</p>
                  <button
                    className="text-2xl"
                    onClick={() => newIndividualChat(trainer._id)}
                  >
                    <BiSolidMessageSquareAdd />
                  </button>
                </div>
              ))
          ) : (
            <h1 className="text-black">No trainers found</h1>
          )}
        </div>
      )}
    </div>
  );
};

const Chat: FC<IChatProps> = ({
  _id,
  icon,
  title,
  selected,
  lastMessage,
  lastMessageTime,
  chatType,
}) => {
  const { selectChat } = useContext(chatContext)!;

  return (
    <button
      onClick={() => selectChat(_id, icon, title, chatType)}
      className={`w-full relative  flex gap-4 items-center mb-4 hover:bg-app-primary  bg-opacity-25 p-2 rounded-md ${
        selected ? "bg-slate-400" : "border border-app-border"
      }`}
    >
      <ProfileImage profileImage={icon} size={16} textSize="3xl" />
      <div>
        <h1 className="font-playwritehu text-sm text-start">{title}</h1>
        <p className="text-sm text-app-neutral text-start">{lastMessage}</p>
        {lastMessageTime && (
          <p className="text-sm text-app-neutral text-start">
            <span>
              {new Date(lastMessageTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
          </p>
        )}

        {chatType == "group" && (
          <Badge className="px-2 py-1 absolute bottom-2 right-1 text-[10px]">
            group
          </Badge>
        )}
      </div>
    </button>
  );
};

export default ChatSidebar;
