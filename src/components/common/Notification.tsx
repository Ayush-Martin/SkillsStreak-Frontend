import { FC, useCallback, useEffect, useState } from "react";
import { getSocket } from "@/config/socket";
import { SocketEvents } from "@/constants/socketEvents";
import { IoIosNotifications, IoIosNotificationsOutline } from "@/assets/icons";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "@/hooks";
import { successPopup } from "@/utils/popup";

interface INotification {
  _id: string;
  message: string;
}

const Notification: FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [open, setOpen] = useState(false);
  const { accessToken } = useSelector((state: RootReducer) => state.user);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const navigate = useNavigate();
  const socket = getSocket();

  const markAsRead = useCallback(
    (id: string) => {
      socket?.emit(SocketEvents.NOTIFICATION_MARK_READ, id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    },
    [socket]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit(SocketEvents.NOTIFICATION_GET);

    socket.on(SocketEvents.NOTIFICATION_GET, (data: INotification[]) => {
      setNotifications(data);
    });

    socket.on(SocketEvents.NOTIFICATION_NEW, (data: INotification) => {
      successPopup(data.message);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off(SocketEvents.NOTIFICATION_GET);
      socket.off(SocketEvents.NOTIFICATION_NEW);
    };
  }, [socket]);

  if (!accessToken)
    return (
      <button
        onClick={() => navigate("/auth")}
        className="mt-1 text-2xl sm:text-3xl text-white hover:text-app-accent transition-colors duration-200"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
      </button>
    );

  return (
    <div className="sm:relative">
      {/* Notification Icon */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative mt-1 text-2xl sm:text-3xl text-white hover:text-app-accent transition-colors duration-200"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shadow-md">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute right-0 top-14 w-full sm:w-[420px] bg-[#0a0d17]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 max-h-[520px] overflow-y-auto z-50
      transition-all duration-300 transform origin-top
      ${
        open
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
      >
        <h2 className="text-lg text-center text-white font-semibold mb-3">
          Notifications
        </h2>

        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="relative flex flex-col p-4 bg-gradient-to-r from-[#1a1d2c]/80 to-[#1f2235]/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
            >
              <p className="text-white text-sm leading-snug break-words mb-5">
                {notification.message}
              </p>
              <span
                onClick={() => markAsRead(notification._id)}
                className="absolute bottom-3 right-3 text-green-400 text-xs font-medium cursor-pointer hover:text-green-300 select-none"
              >
                Mark as read
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-white/50 text-sm py-20">
            No notifications available
          </p>
        )}
      </div>
    </div>
  );
};

export default Notification;
