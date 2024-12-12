import { FaPlane } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Quiz from "./Quiz";

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
            const userLongLat = `${position.coords.latitude},${position.coords.longitude}`;
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);

            // Gunakan functional update untuk menghindari dependensi `data`
            setData((prevData) => ({ ...prevData, userLongLat }));

            const placeName = await getPlaceName(
              position.coords.latitude,
              position.coords.longitude,
            );

            const parts = placeName.split(",");
            parts.shift();

            setPlaceName(parts);
          },
          (err) => {
            setError(err.message);
          },
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []); // Dependency array kosong

  // Function to get place name from latitude and longitude
  const getPlaceName = async (lat, lng) => {
    const apiKey = "AIzaSyAiqiK8tuWVTiNWNUvUO8WyxtYC3h8uaRg"; // Replace with your API key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
    );
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

    const predictReq = await fetch(`${process.env.NEXT_PUBLIC_SPK_API}api/predict2`, {
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
      <div className="md:max-w-[1150px] mx-auto rounded-2xl bg-white shadow-lg -translate-y-24">
        <Quiz />
      </div>
    </section>
  );
}

export default Search;
