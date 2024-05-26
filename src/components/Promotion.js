import { Ubuntu } from "next/font/google";
import { MdKeyboardArrowRight } from "react-icons/md";

import Image from "next/image";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Promotion() {
  return (
    <main className="w-full mx-auto px-4 mt-20">
      <div>
        <div className="mt-10 md:max-w-[1100px] mx-auto bg-white shadow-xl rounded-xl">
          <div className="p-2 flex items-center justify-between">
            <h4 className="text-md font-semibold text-slate-500">
              Lebih Lanjut
            </h4>
            <MdKeyboardArrowRight className="text-3xl text-slate-500" />
          </div>
        </div>
        <div className="h-36 w-full relative mt-10">
          <p className="z-20 text-white text-lg font-bold relative p-6">Explore Keindahan Kudus</p>
          <Image
            src={"/pic/sawah.webp"}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-xl mx-auto shadow-xl"
            alt="sawah"
          />
        </div>
      </div>
    </main>
  );
}
