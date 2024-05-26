import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Ubuntu } from "next/font/google";
import Link from "next/link";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Navbar() {
  return (
    <main
      className={`w-full fixed z-30 py-6 px-4 bg-[#eff1f3] bg-opacity-80 backdrop-blur-md border-t-2 -translate-y-2 ${ubuntu.className}`}
    >
      <div className="text-slate-500 font-medium">
        <ul className="flex justify-center items-center gap-5">
          <li>
            <Link href="/places">Places</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
