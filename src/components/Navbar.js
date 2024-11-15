import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Ubuntu } from "next/font/google";
import { CgProfile } from "react-icons/cg";
import { IoLogOut } from "react-icons/io5";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Navbar() {
  const [userName, setUserName] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name);
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUserName(null);
    setDropdownVisible(false);
  };

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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="flex items-center gap-2 focus:outline-none">
              <span>{userName}</span>
              <CgProfile />
            </button>

            <div className={`flex flex-col justify-center items-center absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 transform transition-opacity duration-300 ease-in-out ${dropdownVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
              <div className="flex items-center justify-between">
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-slate-500">
                  Logout
                </button>
                <span className="pr-3">
                  <IoLogOut />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Link className="block w-full text-left px-4 py-2 text-slate-500" href={'/profile'}>
                  Profile
                </Link>
                <span className="pr-3">
                  <CgProfile />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/auth/login">Login</Link>
        )}
      </div>
    </main>
  );
}
