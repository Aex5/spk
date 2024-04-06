import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Navbar() {
  return (
    <main
      className={`container mx-auto py-12 px-10 font-bold text-2xl ${ubuntu.className}`}
    >
      <div className="flex text-slate-500 justify-between items-center">
        <FaBars />
        <h1 className="text-xl">Discover</h1>
        <FaSearch />
      </div>
    </main>
  );
}
