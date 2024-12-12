import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function UpdateUser() {
  const router = useRouter();
  const user_id = router.query.id;
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    email: "",
    usernme: "",
    name: "",
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
    }
    console.log(user);
  }, []);

  async function submitHandler(e) {
    e.preventDefault();

    const UpdateReq = await fetch(
      `${process.env.NEXT_PUBLIC_SPK_API}api/user/update/${user.userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const UpdateRes = await UpdateReq.json();
    if (UpdateRes.status === "success") {
      toast.success("Update successful!");
      router.push("/");
    } else {
      toast.error(`${UpdateRes.message}`);
    }
  }

  function formHandler(e) {
    e.preventDefault();

    const value = e.target.value;
    const name = e.target.name;

    setData({ ...data, [name]: value });
  }

  return (
    <Layout>
      <div className="font-[sans-serif] text-[#333]">
        <div className="min-h-screen flex items-center justify-center py-6 px-4">
          <form
            onSubmit={submitHandler}
            className="space-y-6 max-w-md max-md:mx-auto w-full"
          >
            <h3 className="text-3xl font-extrabold mb-8 max-md:text-center">
              Edit Profil
            </h3>
            {user ? (
              <>
                <div>
                  <input
                    name="email"
                    value={`${user.email}`}
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-gray-100 w-full text-sm px-4 py-3.5 rounded-md outline-blue-600"
                    placeholder="Alamat email"
                    onChange={formHandler}
                  />
                </div>
                <div>
                  <input
                    name="username"
                    value={`${user.name}`}
                    required
                    className="bg-gray-100 w-full text-sm px-4 py-3.5 rounded-md outline-blue-600"
                    placeholder="Username"
                    onChange={formHandler}
                  />
                </div>
                <div className="!mt-10">
                  <button
                    type="submits"
                    className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Simpan
                  </button>
                </div>
              </>
            ) : (
              <p>load</p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
