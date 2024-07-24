import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaRegStar } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaMountainSun } from "react-icons/fa6";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Card() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const router = useRouter();

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

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/find?query=${query}`);
  };

  return (
    <main className="w-full p-4 my-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-2xl underline text-slate-700 mb-10">
            Destinasi yang Selalu <br /> Ramai Pengunjung
          </h2>

          <form onSubmit={handleSearch}>
            <input
              className="py-1 px-4 rounded-md mr-5 border-2"
              type="text"
              placeholder="cari destinasi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-slate-600 text-slate-100 py-1 px-4 rounded-md border-2"
            >
              Cari
            </button>
          </form>
        </div>
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

              <div>
                <div className="py-2">
                  <h2 className="font-bold text-xl text-slate-700">
                    {dest.destination_name}
                  </h2>
                </div>
                <div className="flex justify-between gap-5 text-sm items-center px-2 py-2 text-slate-500">
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

              <div className="flex justify-between items-center pt-10">
                <div className="bg-gradient-to-r from-slate-200 to-transparent pl-2 py-1">
                  <h1 className="text-base font-bold text-slate-700">
                    Rp.{dest.harga_tiket}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Sudah termasuk fasilitas
                  </p>
                </div>

                <button className="bg-slate-600 text-slate-100 py-3 px-4">
                  Lebih lanjut
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
