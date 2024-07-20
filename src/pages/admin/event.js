// pages/event.js
import Layout from "./elements/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function Event({ events }) {
  const [data, setData] = useState({
    event_name: "",
    event_description: "",
    event_date: "",
    destination_id: "",
  });

  async function submitHandler(e) {
    e.preventDefault();

    const loginReq = await fetch("http://localhost:3001/api/event/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const loginRes = await loginReq.json();
    if (loginRes.status === "success") {
      toast.success("Create successful!");
      // Reset form fields to initial state
      setData({
        event_name: "",
        event_description: "",
        event_date: "",
        destination_id: "",
      });
    } else {
      toast.error(`${loginRes.message}`);
    }
  }

  function formHandler(e) {
    const value = e.target.value;
    const name = e.target.name;

    setData({ ...data, [name]: value });
  }

  return (
    <Layout>
      <div className="pl-64">
        <h1>Tambah Event</h1>
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full bg-white">
            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="event_name"
                  id="name"
                  placeholder="Nama Event"
                  value={data.event_name}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="event_description"
                  id="deskripsi"
                  placeholder="Deskripsi"
                  value={data.event_description}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="destination_id"
                  id="destinasi"
                  placeholder="Destinasi"
                  value={data.destination_id}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <label
                      htmlFor="date"
                      className="mb-3 block text-base font-medium text-[#07074D]"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      onChange={formHandler}
                      id="date"
                      value={data.event_date}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                  Tambah Event
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12 p-12">
          <h2 className="text-2xl font-bold mb-6">Daftar Event</h2>
          <div className="grid grid-cols-3 gap-5">
            {events.data.map((e, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg mb-6"
              >
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {e.event_name}
                </p>
                <p className="text-base text-gray-700 mb-2">
                  {e.event_description}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Tanggal: {e.event_date}
                </p>
                <p className="text-sm text-gray-600">
                  Destinasi: {e.destination_id}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await axios.get("http://localhost:3001/api/events");
  const events = res.data;

  // Pass data to the page via props
  return { props: { events } };
}

export default Event;
