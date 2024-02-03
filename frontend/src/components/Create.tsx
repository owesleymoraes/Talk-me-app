"use client";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { Input } from "./Input";
import { FormEvent, useRef } from "react";

export default function CreateRoom() {
  const name = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCreateRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.current && name.current.value !== "") {
      sessionStorage.setItem("username", name.current.value);
      const roomId = generateRandomString();
      console.log("handleCreateRoom - room: ", roomId);
      router.push(`/room/${roomId}`);
    }
  };

  function generateRandomString() {
    return Math.random().toString(36).substring(2, 7);
  }

  return (
    <form className="space-y-8" onSubmit={(e) => handleCreateRoom(e)}>
      <Input placeholder="Seu nome" type="text" ref={name} />
      <Button type="submit">Entrar</Button>
    </form>
  );
}
