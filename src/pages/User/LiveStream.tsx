import { LiveChat } from "@/components";
import { useUserStream } from "@/hooks";
import { UserLayout } from "@/layouts";

const LiveStream = () => {
  const { cameraVideoRef, roomId, screen, screenShareRef } = useUserStream();

  return (
    <UserLayout>
      <div className="flex flex-col gap-4 px-5 py-10 md:px-20 lg:flex-row">
        <div className="relative p-3 border rounded-md lg:w-4/6 border-app-border ">
          <video
            ref={screenShareRef}
            className={screen ? "block" : "hidden"}
            autoPlay
            style={{
              width: "100%",
              height: "auto",
            }}
          />
          <video
            ref={cameraVideoRef}
            className={
              screen
                ? "absolute bottom-6 right-6 w-16 h-16 md:w-20 md:h-20  lg:w-32 lg:h-32  object-cover block border-4 border-white shadow-xl"
                : "w-full h-auto"
            }
            autoPlay
            playsInline
          />
        </div>
        <LiveChat roomId={roomId} />
      </div>
    </UserLayout>
  );
};

export default LiveStream;
