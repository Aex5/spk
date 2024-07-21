import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegStar } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaMountainSun } from "react-icons/fa6";

import Image from "next/image";

export default function Card() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/destination/top"
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="w-full p-4 my-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="font-semibold text-2xl text-slate-700 mb-10">
          Yang lagi viral
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {data.map((dest, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden relative sm:rounded-lg mb-4"
            >
              <div className="h-48 w-full relative">
                <Image
                  src={dest.image}
                  alt={`${dest.destinationName}`}
                  className="rounded-2xl object-cover"
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              <div className="py-2">
                <div className="">
                  <h2 className="font-bold text-xl text-center text-slate-700">
                    {dest.destination_name}
                  </h2>
                </div>
                <div className="flex justify-center gap-5 text-sm items-center px-2 py-2 text-slate-500">
                  <div className="flex items-center gap-2 pt-2">
                    <FaRegStar /> {dest.rating} Rating
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <IoPersonSharp /> {dest.jumlah_pengunjung} wisatawan
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                  <FaMountainSun /> {dest.category}
                  </div>
                </div>
                <p>{dest.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
