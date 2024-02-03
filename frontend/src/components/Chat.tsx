import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SocketContext } from "@/contexts/SocketContext";

interface IChatMessage {
  message: string;
  username: string;
  roomId: string;
  time: string;
}

export default function Chat({ roomId }: { roomId: string }) {
  const currentMsg = useRef<HTMLInputElement>(null);
  const { socket } = useContext(SocketContext);
  const [chat, setChat] = useState<IChatMessage[]>([]);

  useEffect(() => {
    socket?.on("chat", (data) => {
      console.log("message: ", data);
      setChat((prevState) => [...prevState, data]);
    });
  }, [socket]);

  function handleSendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentMsg.current && currentMsg.current?.value != "") {
      const sendMsgToServer = {
        message: currentMsg.current.value,
        username: "Wesley Moraes",
        roomId,
        time: new Date().toLocaleTimeString(),
      };
      socket?.emit("chat", sendMsgToServer);
      setChat((prevState) => [...prevState, sendMsgToServer]);

      currentMsg.current.value = "";
    }
  }

  return (
    <div className=" relative max-h-[69vh] bg-gray-900 px-4 pt-4 md:w-[15%] hidden md:flex rounded-md m-3 h-full">
      <div className=" h-full w-full">
        {chat.map((chat, index) => {
          return (
            <div key={index} className="bg-gray-950 rounded p-2 mb-4">
              <div className="flex items-center text-pink-400 space-x-2">
                <span>{chat.username}</span>
                <span>{chat.time}</span>
              </div>
              <div className="mt-5 text-sm">
                <p>{chat.message}</p>
              </div>
            </div>
          );
        })}

        <form
          onSubmit={(e) => handleSendMessage(e)}
          className="absolute bottom-4 inset-x-3"
        >
          <div className="flex relative ">
            <input
              type="text"
              name=""
              id=""
              ref={currentMsg}
              className="px-3 py-2 bg-gray-950 rounded-md w-full"
            />
            <button type="submit">
              <Image
                className="absolute right-2 top-2.5 cursor-pointer"
                src="/send.png"
                width={20}
                height={20}
                alt="Send"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
