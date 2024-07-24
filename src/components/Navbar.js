import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Ubuntu } from "next/font/google";
import Link from "next/link";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Navbar() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name);
    }
  }, []);

  return (
    <main
      className={`w-full fixed z-30 py-6 px-4 bg-[#eff1f3] bg-opacity-80 backdrop-blur-md border-t-2 -translate-y-2 ${ubuntu.className}`}
    >
      <div className="md:max-w-[1100px] mx-auto flex justify-between text-slate-500 font-medium">
        <p>KudusSeru</p>
        <ul className="flex justify-center items-center gap-5">
          <li>
            <Link href="/">Beranda</Link>
          </li>
          <li>
            <Link href="/places">Destinasi</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
        </ul>
        {userName ? (
          <p>{userName}</p>
        ) : (
          <Link href="/auth/login">Login</Link>
        )}
      </div>
    </main>
  );
}
