import Image from "next/image";

export default function Header() {
  return (
    <>
      <div className="flex justify-between bg-gray-1000 p-4">
        <Image alt="Talk to me" src={"/logo.svg"} width={120} height={120} />
        <Image alt="Hero code" src={"/hero.svg"} width={60} height={60} />
      </div>
    </>
  );
}
