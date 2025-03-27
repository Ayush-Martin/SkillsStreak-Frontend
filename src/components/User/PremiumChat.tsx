// import { Button, Input, ScrollArea } from "@/components/ui";
// import { axiosGetRequest } from "@/config/axios";
// import { FC, useEffect, useState } from "react";
// import useSubscription from "@/hooks/useSubscription";
// import { Users, Search } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootReducer } from "@/store";
// import { getSocket } from "@/config/socket";
// import { Chat } from "@/components";
// import { BiSolidMessageSquareAdd, FaLock } from "@/assets/icons";
// import { successPopup } from "@/utils/popup";
// import { IPremiumChat, IPremiumMessage } from "@/types/chatType";

// const PremiumChat = () => {
//   const socket = getSocket();
//   const [chatAccess, setChatAccess] = useState(true);
//   const [selectedChat, setSelectedChat] = useState<{
//     chatUserId: string;
//     chatUserName: string;
//     chatId: string | null;
//   }>();
//   const [chats, setChats] = useState<Array<IPremiumChat>>([]);
//   const { _id } = useSelector((state: RootReducer) => state.user);
//   const getSubscription = useSubscription();
//   const [open, setOpen] = useState(true);

//   const fetchChat = async () => {
//     const res = await axiosGetRequest(`/chats`);
//     if (!res) {
//       setChatAccess(false);
//       return;
//     }
//     setChats(res.data);
//     setChatAccess(true);
//     socket.on("new chat", (data: IPremiumChat) => {
//       if (data.trainerId == _id) return;
//       setChats((chats) => [...chats, { ...data, lastMessage: "" }]);
//     });

//     socket.on("new message", (data: IPremiumMessage) => {
//       setChats((chats) =>
//         chats.map((chat) =>
//           chat._id == data.chatId
//             ? { ...chat, lastMessage: data.message }
//             : chat
//         )
//       );
//     });
//   };

//   useEffect(() => {
//     fetchChat();
//   }, []);

//   const handleSubscription = () => {
//     getSubscription((message: string | undefined) => {
//       successPopup(message || "enrolled");
//       fetchChat();
//     });
//   };

//   const messageTrainer = (trainerId: string, trainerName: string) => {
//     setSelectedChat({
//       chatUserId: trainerId,
//       chatId: null,
//       chatUserName: trainerName,
//     });
//     setOpen(false);
//   };

//   return (
//     <>
//       <div
//         className="flex justify-center mb-4 sm:hidden"
//         onClick={() => setOpen((x) => !x)}
//       >
//         <Button variant={"v2"}>Chats</Button>
//       </div>
//       <div
//         className={`flex flex-col sm:flex-row h-[600px] relative rounded-md border border-app-border shadow-[0px_4px_10px_rgba(173,216,230,0.5)] hover:shadow-[0px_6px_15px_rgba(173,216,230,0.7)] transition-shadow duration-300`}
//       >
//         {chatAccess === false && (
//           <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center h-full gap-2 bg-black bg-opacity-55 backdrop-blur-sm">
//             <h1 className="flex flex-col items-center justify-center gap-2 text-2xl text-app-accent">
//               <FaLock className="text-3xl" /> You don't have access
//             </h1>
//             <Button variant={"v1"} onClick={handleSubscription}>
//               Subscribe
//             </Button>
//           </div>
//         )}

//         {/* Sidebar for Chats */}
//         <div
//           className={` z-10  w-3/4 sm:block h-full sm:w-1/4 min-w-[300px] shadow-md bg-[#030d16] border-r border-gray-700 flex flex-col ${
//             open ? "absolute" : "hidden"
//           }`}
//         >
//           <div className="p-4 border-b border-gray-700">
//             <h2 className="text-2xl font-semibold text-center font-winkysans">
//               Chats
//             </h2>
//             <SearchTrainers messageTrainer={messageTrainer} />
//           </div>

//           {/* Scrollable chat list */}
//           <ScrollArea className="flex-1 w-full">
//             {chats.map((chat) => (
//               <div
//                 key={chat.userId}
//                 className={`flex items-center p-4 hover:bg-[#091926] cursor-pointer transition-colors ${
//                   selectedChat?.chatUserId === chat.userId ||
//                   selectedChat?.chatId === chat._id
//                     ? " border-l-8 border-b-2 border-b-green-300 border-blue-500"
//                     : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedChat({
//                     chatUserId: chat.trainerId,
//                     chatId: chat._id,
//                     chatUserName: chat.name,
//                   });
//                   setOpen(false);
//                 }}
//               >
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-medium truncate font-josefinsans">
//                     {chat.name}
//                   </h3>
//                   <p className="text-sm text-gray-400 font-playwritehu">
//                     {chat.lastMessage.length > 40
//                       ? `${chat.lastMessage.slice(0, 40)}...`
//                       : chat.lastMessage}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </ScrollArea>
//         </div>

//         {/* Main Chat Area */}
//         <div className="flex flex-col flex-1">
//           {selectedChat ? (
//             <Chat
//               key={selectedChat.chatUserId}
//               chatUserId={selectedChat.chatUserId}
//               userId={_id}
//               chatId={selectedChat.chatId}
//               chatUserName={selectedChat.chatUserName}
//             />
//           ) : (
//             <div className="flex items-center justify-center flex-1 text-xl text-center text-gray-400 font-boldonse">
//               Select a chat to start messaging
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default PremiumChat;
