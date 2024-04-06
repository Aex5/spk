import { IoMdHome, IoIosCompass, IoIosBookmark } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";

export default function Navigation() {
  return (
    <main className="container mx-auto py-12 px-10 font-bold text-2xl">
      <div className="flex justify-between bg-[#CBE4DE] p-5 rounded-full text-[#0E8388] text-3xl">
        <IoMdHome />
        <IoIosCompass />
        <IoIosBookmark />
        <MdAccountCircle />
      </div>
    </main>
  );
}
