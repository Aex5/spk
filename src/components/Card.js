import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

import { FaStar } from "react-icons/fa";

export default function Card() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:8080/api/top-dest");
        setData(response.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    return () => {};
  }, []);

  return (
    <main className={`w-full p-4 my-6`}>
      <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-4">
      <h2 className="font-semibold text-2xl text-slate-700 mb-10">
        Yang lagi rame

      </h2>
        {data.map((d, index) => {
          return (
            <Link
              href="/"
              key={index}
              className="flex gap-2"
            >
              <div className="h-40 w-full">
                <img
                  src={d.image}
                  alt={`${d.name}`}
                  className="rounded-md shadow-xl object-cover h-full w-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
              
            </Link>
          );
        })}
      </div>
    </main>
  );
}
