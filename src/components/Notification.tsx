import { useEffect, useState } from "react";
import { getSocket } from "@/config/socket";
import { SocketEvents } from "@/constants/socketEvents";
import {
  IoIosNotifications,
  IoIosNotificationsOutline,
  IoCloseCircle,
  MdClear,
} from "@/assets/icons";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { useNavigate } from "react-router-dom";

interface INotification {
  _id: string;
  message: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Array<INotification>>([]);
  const [open, setOpen] = useState(false);
  const { accessToken } = useSelector((state: RootReducer) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("notification socket ", accessToken);
    if (accessToken) {
      const socket = getSocket();

      socket.emit(SocketEvents.NOTIFICATION_GET);

      socket.on(SocketEvents.NOTIFICATION_GET, (data: Array<INotification>) => {
        setNotifications(data);
      });

      socket.on(SocketEvents.NOTIFICATION_NEW, (data: INotification) => {
        console.log("new notification fasdfasdfsadfasdfadfasdfasdfs", data);
        setNotifications(() => [data, ...notifications]);
      });

      return () => {
        socket.off(SocketEvents.NOTIFICATION_GET);
      };
    }
  }, [accessToken]);

  if (!accessToken)
    return (
      <button
        onClick={() => navigate("/auth")}
        className="mt-1 text-3xl text-white"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
      </button>
    );

  const markAsRead = (id: string) => {
    const socket = getSocket();
    socket.emit(SocketEvents.NOTIFICATION_MARK_READ, id);
    setNotifications(notifications.filter((n) => n._id !== id));
  };

  console.log(notifications);

  return (
    <div className="sm:relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="mt-1 text-3xl text-white"
      >
        {open ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
      </button>
      {open && (
        <div className="absolute  w-full  left-0 right-0  sm:left-auto max-h-[500px] bg-[#282828] rounded-md sm:w-[500px] top-14 bg-opacity-90 backdrop-blur-lg px-7 py-5 ">
          <div className="flex justify-between">
            <h1 className="text-2xl text-center text-white">Notifications</h1>
            <button className="text-2xl" onClick={() => setOpen(false)}>
              <IoCloseCircle />
            </button>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto h-[400px] mt-7 ">
            {notifications.map((notification) => (
              <div
                className="flex px-10 py-5 rounded bg-app-border full"
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
