import { NewStream, TrainerStream } from "@/components";
import { TrainerLayout } from "@/layouts";
import { RootReducer } from "@/store";
import { useSelector } from "react-redux";

const LiveStream = () => {
  const { roomId, token } = useSelector(
    (state: RootReducer) => state.trainerStream
  );
  console.log(roomId, token);
  return (
    <TrainerLayout>
      {!roomId || !token ? (
        <NewStream />
      ) : (
        <TrainerStream roomId={roomId} token={token} />
      )}
    </TrainerLayout>
  );
};

export default LiveStream;
