import Image from "next/image";
import Link from "next/link";
import { Ubuntu } from "next/font/google";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";



const data = {
  pic: [
    { name: "Gunung Muria", src: "gnmuria.jpg", type: "Alam" },
    { name: "Rahtawu", src: "tebing.jpg", type: "Alam" },
    { name: "Masjid Al-Aqsa", src: "menara.webp", type: "Religi" },
    { name: "Rahtawu", src: "tebing.jpg", type: "Alam" },
  ],
};

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function App() {
  return (
    <main className={`relative py-1 ${ubuntu.className}`}>
      <div class="bg-gradient-to-r from-white w-24 h-full absolute z-20 -top-1"></div>
      <div class="bg-gradient-to-l from-white w-24 h-full absolute z-20 -top-1 right-0"></div>
      <Swiper
        spaceBetween={15}
        slidesPerView={1}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: null,
          nextEl: null,
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        {data.pic.map((p, index) => (
          <SwiperSlide key={index}>
            <Link href={`/places/${p.name}`} key={index}>
              <div className="w-full">
                <div className="h-44 w-full relative ">
                  <Image
                    src={`/pic/${p.src}`}
                    alt={`${p.name}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl mx-auto shadow-xl"
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
