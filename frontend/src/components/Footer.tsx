"use client";
import { useState } from "react";
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

export default function Footer() {
  const [isMuted, setMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false);
  const [isScreenSharing, setScreenSharing] = useState(false);

  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0") + ":";
  const minutes = date.getMinutes().toString().padStart(2, "0");
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
                onClick={() => setMuted(!isMuted)}
              />
            ) : (
              <Mic
                className="h-10 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => setMuted(!isMuted)}
              />
            )}
            {isCameraOff ? (
              <NoCamera
                className="h-10 w-16 text-white p-2 bg-red-500 rounded-md cursor-pointer"
                onClick={() => setCameraOff(!isCameraOff)}
              />
            ) : (
              <Camera
                className="h-10 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => setCameraOff(!isCameraOff)}
              />
            )}
            {isScreenSharing ? (
              <NoComputer
                className="h-10 w-16 text-white p-2 bg-red-500 rounded-md cursor-pointer"
                onClick={() => setScreenSharing(!isScreenSharing)}
              />
            ) : (
              <Computer
                className="h-10 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => setScreenSharing(!isScreenSharing)}
              />
            )}
            <Phone className="h-10 w-16 text-white hover:bg-red-500 p-2 bg-primary rounded-md cursor-pointer" />
          </div>
        </div>
      </Container>
    </div>
  );
}
