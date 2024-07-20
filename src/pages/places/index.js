import Image from "next/image";
import Layout from "@/components/Layout";

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3001/api/destinations");
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    const result = await res.json();

    return { props: { result } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { result: null } }; // Mengembalikan null jika terjadi kesalahan
  }
}

const truncateText = (text, limit) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

export default function Page({ result }) {
  if (!result) {
    return <div>Error fetching data</div>; // Menampilkan pesan kesalahan jika data tidak tersedia
  }

  return (
    <Layout>
      <section className="w-full pt-28">
        <div className="pb-10 md:max-w-[1100px] mx-auto">
          <h1 className="font-bold text-4xl text-slate-700 mb-10">
            Daftar Wisata
          </h1>
          <p className="text-lg text-slate-500 mb-10">
            Temukan destinasi wisata terbaik yang memukau mata dan jiwa. Dari
            keajaiban alam hingga keunikan budaya, setiap tempat menjanjikan
            pengalaman tak terlupakan. Mulailah petualangan Anda dan temukan
            destinasi impian di sini!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-20">
            {result.data.map((dest, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden relative sm:rounded-lg mb-4"
              >
                <div className="h-64 w-full relative">
                  <Image
                    src={dest.image}
                    alt={`${dest.destinationName}`}
                    className="rounded-3xl object-cover"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <div className="bg-white border-2 rounded-3xl p-6 -translate-y-12">
                  <div className="flex justify-between mb-6">
                    <h2 className="font-bold text-xl text-slate-700">
                      {dest.destination_name}
                    </h2>
                    <div>
                      <p>{dest.rating} ⭐️ (review)</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-md text-slate-500 mb-6">
                      {truncateText(dest.description, 150)}
                    </p>
                  </div>
                  <hr />
                  <p>{dest.score}</p>
                  <button className="text-[#0E8388] bg-[#CBE4DE] p-2 rounded-lg mt-4">
                    <p>Lihat Selengkapnya</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
