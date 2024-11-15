import { Ubuntu } from "next/font/google";

import Image from "next/image";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Promotion() {
  return (
    <main className="w-full mx-auto px-4 mt-20">
      <div>
        <div className="mt-10 md:max-w-[1100px] mx-auto rounded-xl">
          <h2 className="font-semibold text-2xl underline text-slate-700 mb-10">
            Sejarah Singkat Kota Kudus
          </h2>
          <p className="text-lg text-slate-500 text-justify">
            Kudus adalah sebuah kota di Provinsi Jawa Tengah yang dikenal sebagai pusat penyebaran Islam di Jawa, berkat peran Sunan Kudus, salah satu dari Walisongo. Kota ini memiliki warisan budaya yang kaya, termasuk Masjid Menara Kudus, yang memadukan arsitektur Islam dengan unsur Hindu-Buddha. Kudus juga terkenal sebagai pusat industri rokok kretek dan memiliki ekonomi yang tumbuh di sekitar sektor ini. Kota ini menawarkan perpaduan sejarah, religi, dan industri, menjadikannya destinasi unik di Jawa Tengah.
          </p>
          <div className="h-36 relative mt-10">
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

      </div>
    </main>
  );
}
