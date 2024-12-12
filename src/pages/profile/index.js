import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);

      axios
        .get(`${process.env.NEXT_PUBLIC_SPK_API}api/user/${parsedUser.userId}/comments`)
        .then((response) => {
          setUserComments(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user comments:", error);
        });
    }
  }, []);

  return (
    <Layout>
      <section className="w-full pt-28">
        <div className="pb-10 md:max-w-[1100px] mx-auto bg-slate-100 rounded-3xl">
          <div className="flex items-center justify-start gap-5 p-10">
            <div className="w-52 h-52 rounded-full bg-blue-100"></div>
            <div>
              {user ? (
                <>
                  <h1 className="font-bold text-4xl text-slate-700 mb-5">
                    {user.name}
                  </h1>
                  <p>{user.email}</p>

                  <div className="space-x-2">
                    <Link href={`/profile/edit/${user.userId}`}>
                      <button className="text-white bg-blue-700 p-3 rounded-md mt-5">
                        Edit Profil
                      </button>
                    </Link>

                    <Link href={`/profile/event/${user.userId}`}>
                      <button className="text-white bg-slate-600 p-3 rounded-md mt-5">
                        Event Diikuti
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>

        <div className="md:max-w-[1100px] mx-auto bg-white rounded-3xl -translate-y-10 shadow-lg">
          <div className="p-10">
            <h1 className="font-bold text-xl text-slate-600 mb-5">
              Komentar Terakhir
            </h1>
            {userComments && userComments.length > 0 ? (
              userComments.map((comment, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center gap-5 bg-white p-4 rounded-xl border border-gray-300">
                    <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                    <div>
                      <h5 className="text-slate-700 font-semibold text-lg">
                        {comment.username || "Anonymous"}
                      </h5>
                      <p className="text-xs text-slate-400 mb-5">
                        {new Date(comment.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "short",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-slate-500">{comment.comment}</p>
                      <p className="text-slate-500">
                        {comment.destination_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Tidak ada komentar</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
