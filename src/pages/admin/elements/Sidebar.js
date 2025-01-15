
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { FaHome, FaCogs, FaUsers, FaCalendarAlt} from "react-icons/fa";
import { RxCaretRight } from "react-icons/rx";
import { IoLogOut } from "react-icons/io5";

function Sidebar() {
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);
  const router = useRouter();

  const toggleCriteriaDropdown = () => {
    setIsCriteriaOpen(!isCriteriaOpen);
  };

  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 bg-gray-50 text-gray-800 absolute">
      <div className="fixed flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
        <div className="flex items-center justify-center h-14 border-b">
          <div>KuduSeru</div>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">
                  Menu
                </div>
              </div>
            </li>
            <li>
              <Link
                href="/admin/dashboard"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FaHome className="w-4 h-4" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Beranda
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={toggleCriteriaDropdown}
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 w-full"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FaCogs className="w-4 h-4" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Data
                </span>
                <RxCaretRight
                  className={`w-4 h-4 ml-auto transition-transform ${
                    isCriteriaOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {isCriteriaOpen && (
                <ul className="ml-8 mt-1 space-y-1">
                  <li>
                    <Link
                      href="/admin/criteria"
                      className="relative flex flex-row items-center h-10 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                    >
                      <span className="ml-2 text-sm tracking-wide truncate">
                        Kriteria
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/alternative"
                      className="relative flex flex-row items-center h-10 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                    >
                      <span className="ml-2 text-sm tracking-wide truncate">
                        Alternatif
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/admin/event"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FaCalendarAlt className="w-4 h-4" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Event
                </span>
              </Link>
            </li>
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">
                  Tasks
                </div>
              </div>
            </li>
            <li>
              <Link
                href="/admin/user"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FaUsers className="w-4 h-4" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Users
                </span>
                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">
                  15
                </span>
              </Link>
            </li>
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">
                  Pengaturan
                </div>
              </div>
            </li>
            <li>
              <a
                href="#"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <IoLogOut className="w-5 h-5" />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Logout
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
