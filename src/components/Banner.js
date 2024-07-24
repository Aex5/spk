import Image from "next/image";
import Link from "next/link";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function App() {
  return (
    <section className="pt-16">
      <div className="bg-slate-200 w-full h-[600px] relative">
        <Image src={"/pic/banner.jpg"} layout="fill" objectFit="cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-40 text-white">
          <h1 className=" bg-[#eff1f3] bg-opacity-10 backdrop-blur-sm py-1 px-3 font-light text-4xl">Rekomendasi Wisata Kudus</h1>
          <p className=" bg-[#eff1f3] bg-opacity-10 backdrop-blur-sm py-1 px-3">cari tempat destinasi wisatamu dengan satu kali klik !</p>
        </div>
      </div>
    </section>
  );
}
