import { axiosGetRequest } from "@/config/axios";
import { createLocalTracks, Room, VideoPresets } from "livekit-client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

const useTrainerLiveSession = () => {
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [recordedSrc, setRecordedSrc] = useState("");
  const { liveSessionId, courseId } = useParams();

  useEffect(() => {
    const fetchLiveSession = async () => {
      const res = await axiosGetRequest(
        `/trainer/courses/${courseId}/liveSessions/${liveSessionId}`
      );
      if (!res) return;
      if (res.data.token) {
        await startStream(res.data.token, res.data.liveSession._id);
      } else {
        setRecordedSrc(res.data.liveSession.recordedSrc);
      }
    };

    fetchLiveSession();

    return () => {
      if (room) {
        // endStream();
        room.disconnect();
      }
    };
  }, [room]);

  const startStream = async (token: string, roomId: string) => {
    try {
      setIsStreaming(true);

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      setRoom(room);
      setRoomId(roomId);

      await room.connect(LIVEKIT_URL, token);

      room.localParticipant.on("trackPublished", (publication) => {
        if (!publication.track) return;
        const mediaStream = new MediaStream([
          publication.track.mediaStreamTrack,
        ]);

        if (publication.source === "camera") {
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = mediaStream;
            cameraVideoRef.current.play().catch((err) => {
              console.warn("Could not autoplay camera video:", err);
            });
          }
        }

        if (publication.source === "screen_share") {
          if (screenShareRef.current) {
            screenShareRef.current.srcObject = mediaStream;
            screenShareRef.current.play().catch((err) => {
              console.warn("Could not autoplay screen share:", err);
            });
          }
        }
      });

      const localTracks = await createLocalTracks({
        video: { ...VideoPresets.h720, facingMode: "user" },
        audio: true,
      });

      for (const track of localTracks) {
        await room.localParticipant.publishTrack(track);

        if (track.kind === "video") {
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = new MediaStream([
              track.mediaStreamTrack,
            ]);
            cameraVideoRef.current.play().catch((err) => {
              console.warn("Could not autoplay video:", err);
            });
          }
        }
      }
    } catch (err) {
      console.error("Error starting stream:", err);
      setIsStreaming(false);
    }
  };

  const stopStreaming = async () => {
    if (room) {
      try {
        await room.disconnect();
        setRoom(null);
        setIsStreaming(false);
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
        setIsScreenSharing(false);

        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = null;
        }
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = null;
        }
      } catch (err) {
        console.error("Error stopping stream:", err);
      }
    }
  };

  const toggleVideo = async () => {
    if (!room) return;

    try {
      const enabled = !isVideoEnabled;
      if (enabled) {
        const publication = await room.localParticipant.setCameraEnabled(true);
        const track = publication?.track;

        if (track && cameraVideoRef.current) {
          const mediaStream = new MediaStream([track.mediaStreamTrack]);
          cameraVideoRef.current.srcObject = mediaStream;
          cameraVideoRef.current.play().catch((err) => {
            console.warn("Could not autoplay video:", err);
          });
        }
      } else {
        await room.localParticipant.setCameraEnabled(false);
      }
      setIsVideoEnabled(enabled);
    } catch (err) {
      console.error("Error toggling video:", err);
    }
  };

  const toggleAudio = async () => {
    if (!room) return;
    try {
      const enabled = !isAudioEnabled;
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setIsAudioEnabled(enabled);
    } catch (err) {
      console.error("Error toggling audio:", err);
    }
  };

  const toggleScreenShare = async () => {
    if (!room) return;

    try {
      const enabled = !isScreenSharing;

      if (enabled) {
        const publication = await room.localParticipant.setScreenShareEnabled(
          true
        );
        const track = publication?.track;

        if (track && screenShareRef.current) {
          const mediaStream = new MediaStream([track.mediaStreamTrack]);
          screenShareRef.current.srcObject = mediaStream;
          screenShareRef.current.play().catch((err) => {
            console.warn("Could not autoplay screen share:", err);
          });
        }
      } else {
        await room.localParticipant.setScreenShareEnabled(false);
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = null;
        }
      }

      setIsScreenSharing(enabled);
    } catch (err) {
      console.error("Error toggling screen share:", err);
    }
  };

  return {
    room,
    roomId,
    isStreaming,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    cameraVideoRef,
    screenShareRef,
    startStream,
    stopStreaming,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    recordedSrc,
  };
};

export default useTrainerLiveSession;
