import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserEvent() {
  const [userBooking, setUserBooking] = useState([]);
  const router = useRouter();
  const user_id = router.query.id;

  useEffect(() => {
    if (user_id) {
      axios
        .get(`http://localhost:3001/api/booking/user/${user_id}`)
        .then((response) => {
          setUserBooking(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user event:", error);
        });
    }
  }, [user_id]);

  return (
    <Layout>
      <section className="w-full pt-28">
        <div className="pb-10 md:max-w-[1100px] mx-auto">
          <h1 className="font-bold text-4xl text-slate-700 mb-10">
            Daftar Event Diikuti
          </h1>

          {userBooking.length > 0 ? (
            userBooking.map((d, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-5 bg-white p-4 rounded-xl border border-gray-300">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div>
                    <h5 className="text-slate-700 font-semibold text-lg">
                      Terdaftar sebagai : {d.name || "Anonymous"}
                    </h5>
                    <p className="text-xs text-slate-400 mb-5">
                      {new Date(d.booking_date).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-slate-500">{d.event_name}</p>
                    <p className="text-slate-500">{d.destination_name}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[50vh] flex justify-center items-center">
              <p>Belum ada pendaftaran</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
