"use client";

import Layout from "@/components/Layout";
import User from "@/pages/admin/user";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function EventBooking() {
  const router = useRouter();
  const { id } = router.query;

  const [eventname, setEventname] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState({
    user_id: "",
    event_id: "",
    email: "",
    usernme: "",
    phone: "",
  });

  async function submitHandler(e) {
    e.preventDefault();

    const RegisterReq = await fetch(
      "http://localhost:3001/api/booking/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const RegisterRes = await RegisterReq.json();
    if (RegisterRes.status === "success") {
      toast.success("Registration successful!");
      router.push("/");
    } else {
      toast.error(`${RegisterRes.message}`);
    }
  }
  function formHandler(e) {
    e.preventDefault();

    const value = e.target.value;
    const name = e.target.name;

    setData({ ...data, [name]: value });
  }

  useEffect(() => {
    const bookingSession = JSON.parse(sessionStorage.getItem("bookevent"));
    setEventname(bookingSession.event_name);

    const userSession = JSON.parse(sessionStorage.getItem("user"));
    setUser(userSession);
  }, []);

  useEffect(() => {
    if (user) {
      setData((prevData) => ({
        ...prevData,
        user_id: user.userId, // Set user_id directly if user is present
      }));
    }

    if (id) {
      setData((prevData) => ({
        ...prevData,
        event_id: id, // Set user_id directly if user is present
      }));
    }
  }, [user, id]);

  console.log(id);
  return (
    <Layout>
      <div className="h-[70vh]">
        <h1 className="text-center font-bold text-3xl text-slate-700 mb-10 pt-32 max-w-lg mx-auto">
          Pendaftaran Event {eventname}
        </h1>
        <form onSubmit={submitHandler} className="max-w-md mx-auto">
          <div className="relative z-0 w-full mb-5 group">
            {id ? <input type="hidden" name="event_id" value={id} /> : ""}
            {user ? (
              <input type="hidden" name="user_id" value={data.user_id} />
            ) : (
              ""
            )}
            <input
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={formHandler}
              required
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Alamat Email
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={formHandler}
              required
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nama Lengkap
            </label>
          </div>
          <div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="tel"
                name="phone"
                id="phone"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={formHandler}
                required
              />
              <label
                htmlFor="phone"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Nomer whatsapp
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Daftar
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default EventBooking;
