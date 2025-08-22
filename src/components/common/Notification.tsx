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
  const [notifications, setNotifications] = useState<Array<INotification>>([]);
  const [open, setOpen] = useState(false);
  const { accessToken } = useSelector((state: RootReducer) => state.user);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const navigate = useNavigate();
  const socket = getSocket();

  const markAsRead = useCallback(
    (id: string) => {
      socket.emit(SocketEvents.NOTIFICATION_MARK_READ, id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    },
    [socket]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit(SocketEvents.NOTIFICATION_GET);

    socket.on(SocketEvents.NOTIFICATION_GET, (data: Array<INotification>) => {
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
        className="mt-1 text-2xl text-white sm:text-3xl hover:text-app-accent transition-colors duration-200"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
      </button>
    );

  return (
    <div className="sm:relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative mt-1 text-2xl text-white sm:text-3xl hover:text-app-accent transition-colors duration-200"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-14 w-full sm:w-[500px] bg-blue-500/50 backdrop-blur-md rounded-lg shadow-lg p-6 flex flex-col gap-4 max-h-[500px] overflow-y-auto"
        >
          <h2 className="text-xl text-center text-white font-semibold mb-4">
            Notifications
          </h2>

          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex justify-between items-start p-5 bg-app-primary bg-opacity-90 rounded-xl hover:bg-opacity-95 transition duration-200"
              >
                <p className="text-white text-base leading-relaxed">
                  {notification.message}
                </p>
                <span
                  onClick={() => markAsRead(notification._id)}
                  className="text-green-400 text-sm cursor-pointer hover:text-green-300 select-none ml-4"
                >
                  Mark as read
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-white/70 text-base py-20">
              No notifications available
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
