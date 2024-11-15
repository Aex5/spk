import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FaLocationDot } from "react-icons/fa6";

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3001/api/events");
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    const result = await res.json();

    return { props: { result } };
  } catch (error) {
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
  const router = useRouter();

  if (!result) {
    return <div>Error fetching data</div>; // Menampilkan pesan kesalahan jika data tidak tersedia
  }

  const handleEventClick = (event_name, event_id) => {
    // Simpan eventname dan id ke sessionStorage
    sessionStorage.setItem(
      "bookevent",
      JSON.stringify({ event_name, event_id }),
    );

    // jika tidak ada sessionStorage.getItem("user") maka arahkan ke halaman login
    if (!sessionStorage.getItem("user")) {
      toast.error("Silahkan login terlebih dahulu");
      router.push("/auth/login?redirect=events");
    } else {
      router.push(`/events/booking/${event_id}`);
    }
  };

  return (
    <Layout>
      <section className="w-full pt-28">
        <div className="pb-10 md:max-w-[1100px] mx-auto">
          <h1 className="font-bold text-4xl text-slate-700 mb-10">Event</h1>
          <p className="text-lg text-slate-500 mb-10">
            Temukan event yang sedang berlangsung dan coba ikuti keseruannya
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            {result.data.map((e, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden relative sm:rounded-lg mb-4"
              >
                <div className="bg-white border-2 rounded-3xl p-6">
                  <h2 className="font-bold text-2xl text-slate-700 ">
                    {e.event_name}
                  </h2>
                  <div>
                    <p className=" text-sm text-slate-500 mb-6">
                      {e.event_description}
                    </p>
                  </div>
                  <div className="inline-block text-slate-500 text-sm">
                    <span className="inline-block align-middle text-red-500">
                      <FaLocationDot />
                    </span>
                    <span className="inline-block align-middle ml-2">
                      {e.destination_name}
                    </span>
                  </div>
                  <br/>
                  <button
                    onClick={() => handleEventClick(e.event_name, e.event_id)}
                    className="bg-slate-600 text-sm text-slate-100 p-2 mt-5 rounded-md"
                  >
                    Daftar Event
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
