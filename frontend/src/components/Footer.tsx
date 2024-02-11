"use client";
import { MutableRefObject, useState } from "react";
import { Container } from "./Container";
import {
  Camera,
  Computer,
  Mic,
  NoCamera,
  NoComputer,
  NoMic,
  Phone,
} from "@/Icons";

interface IFooterProps {
  videoMediaStream: MediaStream;
  peerConnections: MutableRefObject<Record<string, RTCPeerConnection>>;
  localStream: MutableRefObject<HTMLVideoElement | null>;
  logout: () => void;
}

export const Footer: React.FC<IFooterProps> = ({
  localStream,
  peerConnections,
  videoMediaStream,
  logout,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false);
  const [isScreenSharing, setScreenSharing] = useState(false);

  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0") + ":";
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const handleToggleMuted = () => {
    videoMediaStream?.getAudioTracks().forEach((tracks) => {
      tracks.enabled = isMuted;
    });
    setIsMuted(!isMuted);

    Object.values(peerConnections.current).forEach((peerConnections) => {
      peerConnections.getSenders().forEach((sender) => {
        if (sender.track?.kind === "audio") {
          if (videoMediaStream?.getAudioTracks().length) {
            sender.replaceTrack(
              videoMediaStream
                ?.getAudioTracks()
                .find((track) => track.kind === "audio") || null
            );
          }
        }
      });
    });
  };

  const handleToggleVideo = () => {
    videoMediaStream?.getVideoTracks().forEach((tracks) => {
      tracks.enabled = isCameraOff;
    });
    setCameraOff(!isCameraOff);

    Object.values(peerConnections.current).forEach((peerConnections) => {
      peerConnections.getSenders().forEach((sender) => {
        if (sender.track?.kind === "video") {
          if (videoMediaStream?.getVideoTracks().length) {
            sender.replaceTrack(
              videoMediaStream
                ?.getVideoTracks()
                .find((track) => track.kind === "video") || null
            );
          }
        }
      });
    });
  };

  const handleToggleScreenSharing = async () => {
    if (!isScreenSharing) {
      const videoSharedScreen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      if (localStream?.current)
        localStream.current.srcObject = videoSharedScreen;
      Object.values(peerConnections.current).forEach((peerConnections) => {
        peerConnections.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(videoSharedScreen.getVideoTracks()[0]);
          }
        });
      });
      setScreenSharing(!isScreenSharing);
      return;
    }

    if (localStream?.current) localStream.current.srcObject = videoMediaStream;

    Object.values(peerConnections.current).forEach((peerConnections) => {
      peerConnections.getSenders().forEach((sender) => {
        if (sender.track?.kind === "video") {
          sender.replaceTrack(videoMediaStream?.getVideoTracks()[0]);
        }
      });
    });
    setScreenSharing(!isScreenSharing);
  };

  return (
    <div className="fixed items-center bottom-0 bg-black py-6 w-full">
      <Container>
        <div className="grid grid-cols-3 items-center">
          <p className=" text-xl ">
            {hours} {minutes}
          </p>
          <div className="flex space-x-6 justify-center ">
            {isMuted ? (
              <NoMic
                className="h-10 w-16 text-white p-2  bg-red-500 rounded-md cursor-pointer"
                onClick={() => handleToggleMuted()}
              />
            ) : (
              <Mic
                className="h-10 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => handleToggleMuted()}
              />
            )}
            {isCameraOff ? (
              <NoCamera
                className="h-10 w-16 text-white p-2 bg-red-500 rounded-md cursor-pointer"
                onClick={() => handleToggleVideo()}
              />
            ) : (
              <Camera
                className="h-10 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => handleToggleVideo()}
              />
            )}
            {isScreenSharing ? (
              <NoComputer
                className="h-10 w-16 text-white p-2 bg-red-500 rounded-md cursor-pointer"
                onClick={() => handleToggleScreenSharing()}
              />
            ) : (
              <Computer
                className="h-10 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => handleToggleScreenSharing()}
              />
            )}
            <Phone
              className="h-10 w-16 text-white hover:bg-red-500 p-2 bg-primary rounded-md cursor-pointer"
              onClick={logout}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};
