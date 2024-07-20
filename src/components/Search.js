import { FaPlane } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { split } from "postcss/lib/list";

function Search() {
  const router = useRouter();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [data, setData] = useState({
    rating: null,
    category: "",
    userLongLat: "",
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            const userLongLat = `${position.coords.latitude},${position.coords.longitude}`;
            setData({ ...data, userLongLat });

            // Fetch place name from Google Places API
            const placeName = await getPlaceName(position.coords.latitude, position.coords.longitude);

            const parts = placeName.split(', ')
            parts.shift();

            setPlaceName(parts);
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
  }, []);

  // Function to get place name from latitude and longitude
  const getPlaceName = async (lat, lng) => {
    const apiKey = "AIzaSyChcunyAdoFI8NlpxlmtPMOyRNI6qfYyVE"; // Replace with your API key
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
    const data = await response.json();
    if (data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return "Unknown place";
  };

  async function generatePredict(e) {
    e.preventDefault();

    // Convert rating to number before sending
    const ratingValue = parseFloat(data.rating);

    // Create the request data object
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
      <div className="md:max-w-[1150px] h-[200px] mx-auto rounded-2xl bg-white shadow-lg -translate-y-24">
        <p className="text-sm px-5 py-3">KuduSeru</p>
        <form action="" onSubmit={generatePredict} className="px-5 flex justify-between">
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
              value={placeName}
              placeholder="Nama tempat"
              type="text"
              className="bg-slate-100 py-2 px-3 w-72 text-sm rounded-lg"
              readOnly
            />
            <input
              value={data.userLongLat}
              placeholder="Lokasi mu (hidden)"
              type="text"
              className="bg-slate-100 py-2 px-3 w-72 text-sm rounded-lg hidden"
              readOnly
              name="userLongLat"
            />
            <select
              id="category"
              name="category"
              onChange={formHandler}
              className="bg-gray-100 py-2 px-3 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Category</option>
              <option value="alam">Alam</option>
              <option value="nongki">Nongki</option>
            </select>
            <input
              placeholder="Rating"
              type="number"
              step="0.1"
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
