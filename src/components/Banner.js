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
      <div className="bg-slate-200 w-full h-[500px] relative">
        <Image
          src={'/pic/banner.jpg'}
          layout="fill"
          objectFit="cover"
        />
        
      </div>
    </section>
  );
}
