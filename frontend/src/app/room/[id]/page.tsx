"use client";
import { useContext, useEffect, useRef } from "react";
import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SocketContext } from "@/contexts/SocketContext";

interface IAnswer {
  sender: string;
  description: RTCSessionDescriptionInit;
}

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext);
  const localStream = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {
    socket?.on("connect", async () => {
      console.log("conectado");
      socket.emit("subscribe", {
        roomId: params.id,
        socketId: socket.id,
      });
      await initCamera();

      socket?.on("new user", (data) => {
        console.log("Novo usuario tentando se conenectar:", data);
        createPeerConnection(data.socketId, false);
        socket.emit("newUserStart", {
          to: data.socketId,
          sender: socket.id,
        });
      });

      socket?.on("newUserStart", (data) => {
        console.log("Usuario conectado na sala", data);
        createPeerConnection(data.sender, true);
      });

      socket?.on("sdp", (data) => {
        handleAnswer(data);
      });
    });
  }, [socket]);

  const handleAnswer = async (data: IAnswer) => {
    const peerConnection = peerConnections.current[data.sender];
    if (data.description.type === "offer") {
      await peerConnection.setRemoteDescription(data.description);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket?.emit("sdp", {
        to: data.sender,
        sender: socket?.id,
        description: peerConnection.localDescription,
      });
    } else if (data.description.type === "answer") {
      console.log("ouvindo a oferta");
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.description)
      );
    }
  };

  const createPeerConnection = async (
    socketId: string,
    createOffer: boolean
  ) => {
    const config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peer = new RTCPeerConnection(config);
    peerConnections.current[socketId] = peer;

    //pedindo para entrar na sala
    if (createOffer) {
      const peerConnection = peerConnections.current[socketId];

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket?.emit("sdp", {
        to: socketId,
        sender: socket?.id,
        description: peerConnection.localDescription,
      });
    }
  };

  const initCamera = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      },
    });

    if (localStream.current) localStream.current.srcObject = video;
  };

  return (
    <div className="h-screen">
      <Header />
      <div className="flex h-[80%] justify-between ">
        <div className="md:w-[85%] w-full m-3 p-4  ">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video
                className="h-full w-full mirror-mode"
                autoPlay
                ref={localStream}
              ></video>
              <span className="absolute bottom-3">Wesley Moraes</span>
            </div>
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video className="h-full w-full"></video>
              <span className="absolute bottom-3">Wesley Moraes</span>
            </div>
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video className="h-full w-full" />
              <span className="absolute bottom-3">Wesley Moraes</span>
            </div>
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video className="h-full w-full"></video>
              <span className="absolute bottom-3">Wesley Moraes</span>
            </div>
          </div>
        </div>
        <Chat roomId={params.id} />
      </div>
      <Footer />
    </div>
  );
}
