import { FaPlane } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function Search() {
  const router = useRouter();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    rating: null,
    category: "",
    userLongLat: "",
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setData({
              ...data,
              userLongLat: `${position.coords.latitude},${position.coords.longitude}`,
            });
          },
          (err) => {
            setError(err.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();

    // Retrieve previous response if exists
    const previousResponse = localStorage.getItem("previousResponse");
    if (previousResponse) {
      console.log("Previous Response:", JSON.parse(previousResponse));
    }
  }, []);

  async function generatePredict(e) {
    e.preventDefault();

    // Konversi rating ke angka sebelum dikirim
    const ratingValue = parseFloat(data.rating);

    // Buat objek data yang akan dikirimkan
    const requestData = {
      ...data,
      rating: ratingValue,
    };

    const predictReq = await fetch("http://localhost:3001/api/predict2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const predictRes = await predictReq.json();
    console.log(predictRes);

    // Save response to localStorage
    localStorage.setItem("previousResponse", JSON.stringify(predictRes));

    if (predictRes.status === "success") {
      toast.success("Prediction successful!");
      router.push("/places/result");
    } else {
      toast.error(`${predictRes.message}`);
    }
  }

  function formHandler(e) {
    e.preventDefault();

    const value = e.target.value;
    const name = e.target.name;

    setData({ ...data, [name]: value });
  }

  return (
    <section className="w-full text-slate-500">
      <div className="md:max-w-[1150px] h-[200px] mx-auto rounded-2xl bg-white shadow-lg -translate-y-24 ">
        <p className="text-sm px-5 py-3">KuduSeru</p>
        <form
          action=""
          onSubmit={generatePredict}
          className="px-5 flex justify-between"
        >
          <div className="flex items-center gap-2">
            <input
              placeholder="Dari"
              type=""
              className="bg-slate-100 py-2 px-3 w-72 rounded-lg"
            />
            <FaPlane />
            <input
              placeholder="Ke"
              type=""
              className="bg-slate-100 py-2 px-3 w-72 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              className="bg-slate-100 py-2 px-3 w-96 rounded-lg"
              placeholder="Tanggal mulai"
            />
          </div>
        </form>
        <div className="px-5">
          <p className="text-sm py-3">Rekomendasi Wisata :</p>
          <form onSubmit={generatePredict} className="flex gap-2">
            <input
              value={
                latitude && longitude
                  ? `${latitude},${longitude}`
                  : "Memuat lokasi..."
              }
              placeholder="Lokasi mu"
              type=""
              className="bg-slate-100 py-2 px-3 w-72 text-sm rounded-lg"
              readOnly
              name="userLongLat"
              onChange={formHandler}
            />
            <select
              id="category"
              name="category"
              onChange={formHandler}
              className="bg-gray-100  py-2 px-3 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option selected>Category</option>
              <option value="alam">Alam</option>
              <option value="nongki">Nongki</option>
            </select>
            <input
              placeholder="Rating"
              type=""
              className="bg-slate-100 py-2 px-3 text-sm w-72 rounded-lg"
              name="rating"
              onChange={formHandler}
            />
            <button
              type="submit"
              className="flex items-center text-[#0E8388] bg-[#CBE4DE] p-2 rounded-lg"
            >
              <span className="mr-2">Generate</span>
              <FaWandMagicSparkles />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Search;
