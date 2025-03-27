import { FC, useCallback, useEffect, useState } from "react";
import { getSocket } from "@/config/socket";
import { SocketEvents } from "@/constants/socketEvents";
import {
  IoIosNotifications,
  IoIosNotificationsOutline,
  MdClear,
} from "@/assets/icons";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "@/hooks";

interface INotification {
  _id: string;
  message: string;
}

const Notification: FC = () => {
  const [notifications, setNotifications] = useState<Array<INotification>>([]);
  const [open, setOpen] = useState(false);
  const { accessToken } = useSelector((state: RootReducer) => state.user);
  const dropdownRef = useClickOutside<HTMLDivElement>(close);
  const navigate = useNavigate();

  const socket = getSocket();

  const markAsRead = useCallback(
    (id: string) => {
      socket.emit(SocketEvents.NOTIFICATION_MARK_READ, id);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n._id !== id)
      );
    },
    [socket, setNotifications]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit(SocketEvents.NOTIFICATION_GET);

    socket.on(SocketEvents.NOTIFICATION_GET, (data: Array<INotification>) => {
      setNotifications(data);
    });

    socket.on(SocketEvents.NOTIFICATION_NEW, (data: INotification) => {
      setNotifications(() => [data, ...notifications]);
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
        className="mt-1 text-2xl text-white sm:text-3xl hover:text-app-accent"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
      </button>
    );

  return (
    <div className="sm:relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="mt-1 text-2xl text-white sm:text-3xl hover:text-app-accent"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
      </button>
      {open && (
        <div
          className="absolute  w-full  left-0 right-0  sm:left-auto max-h-[500px] bg-opacity-90  bg-app-border backdrop-blur-lg rounded-md sm:w-[500px] top-14  px-7 py-5 "
          ref={dropdownRef}
        >
          <h1 className="text-2xl text-center text-white">Notifications</h1>

          <div className="flex flex-col gap-2 overflow-y-auto h-[400px] mt-7 ">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  className="flex px-10 py-5 rounded bg-app-highlight full"
                  key={notification._id}
                >
                  <div className="w-11/12">{notification.message}</div>
                  <button
                    className="w-1/12 text-xl text-green-500"
                    onClick={() => markAsRead(notification._id)}
                  >
                    <MdClear />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-white">
                No notifications available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
