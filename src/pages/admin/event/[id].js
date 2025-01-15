import Layout from "../elements/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/router"

function Event({ events, destinations }) {
  const router = useRouter();
  const destinationOptions = destinations.data.map((d) => ({
    id: d.id,
    name: d.destination_name,
  }));
  console.log(events);

  const [data, setData] = useState({
    event_name: events.event_name,
    event_description: events.event_description,
    event_date: new Date(events.event_date).toISOString().split("T")[0],
    destination_id: events.destination_id,
  });

  async function submitHandler(e) {
    e.preventDefault();

    const createEvent = await fetch(
      `${process.env.NEXT_PUBLIC_SPK_API}api/event/update/${events.event_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const createRes = await createEvent.json();
    if (createRes.status === "success") {
      toast.success("Update successful!");
      // Reset form fields to initial state
      setData({
        event_name: "",
        event_description: "",
        event_date: "",
        destination_id: "",
      });
      router.push('/admin/event')
    } else {
      toast.error(`${createRes.message}`);
    }
  }

  function formHandler(e) {
    const value = e.target.value;
    const name = e.target.name;

    setData({ ...data, [name]: value });
  }

  function handleDestinationChange(e) {
    const selectedDestination = destinationOptions.find(
      (d) => d.name === e.target.value,
    );
    setData({ ...data, destination_id: selectedDestination.id });
  }

  return (
    <Layout>
      <div className="pl-64">
        <h1 className="text-center font-bold text-4xl text-slate-700 mb-10 pt-10">
          Update Event
        </h1>
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
              {/* <div className="mb-5"> */}
              {/*   <select */}
              {/*     onChange={handleDestinationChange} */}
              {/*     name="destination_id" */}
              {/*     id="destinasi" */}
              {/*     className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" */}
              {/*   > */}
              {/*     <option value="" disabled selected> */}
              {/*       Pilih Destinasi */}
              {/*     </option> */}
              {/*     {destinationOptions.map((d) => ( */}
              {/*       <option key={d.id} value={d.name}> */}
              {/*         {d.name} */}
              {/*       </option> */}
              {/*     ))} */}
              {/*   </select> */}
              {/* </div> */}
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
                <button className="hover:shadow-form w-full rounded-md bg-slate-800 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    // Fetch events data
    const eventsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_SPK_API}api/event/${id}`,
    );
    const events = eventsRes.data.data[0];

    // Fetch destinations data
    const destinationsRes = await fetch(
      `${process.env.NEXT_PUBLIC_SPK_API}api/destinations`,
    );
    if (!destinationsRes.ok) {
      throw new Error("Failed to fetch");
    }
    const destinations = await destinationsRes.json();

    // Pass data to the page via props
    return { props: { events, destinations } };
  } catch (error) {
    return { props: { events: null, destinations: null } }; // Mengembalikan null jika terjadi kesalahan
  }
}

export default Event;
