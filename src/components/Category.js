import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const data = {
  category: [
    "Kuliner",
    "Alam",
    "Petualang",
    "Penginapan",
    "Religi",
    "Sejarah",
    "Belanja",
    "Seni",
  ],
};

export default function Category() {
  return (
    <main
      className={`${ubuntu.className} font-medium text-lg tracking-wide text-slate-500 mb-10`}
    >
      <div className="scroba flex gap-5 overflow-x-scroll px-4">
        {data.category.map((d, i) => {
          return (
            <div key={i} className="p-2">
              <a href="#">{d}</a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
