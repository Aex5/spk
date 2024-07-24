import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Quiz() {
  const router = useRouter();
  const [questions, setQuestions] = useState([
    {
      type: "distance",
      question: "Apakah Anda ingin destinasi yang dekat dengan Anda?",
      value: "",
    },
    {
      type: "rating",
      question: "Seberapa penting rating destinasi bagi Anda?",
      value: "",
    },
    {
      type: "harga_tiket",
      question: "Apakah Anda mencari destinasi dengan harga tiket yang murah?",
      value: "",
    },
    {
      type: "jumlah_pengunjung",
      question:
        "Apakah Anda ingin destinasi dengan jumlah pengunjung yang ramai?",
      value: "",
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userLongLat, setUserLongLat] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const userLongLat = `${latitude},${longitude}`;
          setUserLongLat(userLongLat);

          // Fetch place name from Google Maps Geocoding API
          const placeName = await getPlaceName(latitude, longitude);
          setPlaceName(placeName);
        },
        (error) => {
          console.error("Error obtaining geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const getPlaceName = async (lat, lng) => {
    const apiKey = "AIzaSyChcunyAdoFI8NlpxlmtPMOyRNI6qfYyVE"; // Replace with your Google Maps API key
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    if (response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    return "Unknown place";
  };

  const handleChange = (value) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].value = value;
    setQuestions(newQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowModal(false);
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const requestData = {
      preferences: questions,
      userLongLat: userLongLat,
    };

    try {
      const predictReq = await fetch("http://localhost:3001/api/predict", {
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
    } catch (err) {
      toast.error("Error fetching recommendations");
      console.error("Error: ", err);
    }
  };

  return (
    <div className=" p-10">
      <h1 className="text-2xl font-bold mb-4">Rekomendasi Wisata</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            lokasi mu
          </label>
          <input
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="Fetching your location..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            readOnly
            required
          />
          <input
            type="text"
            value={userLongLat}
            onChange={(e) => setUserLongLat(e.target.value)}
            hidden
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600"
        >
          Cari Rekomendasi
        </button>
      </form>

      {showModal && (
        <div className="fixed top-0 right-0 bottom-0 left-0 w-full rounded-xl bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-lg w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {questions[currentQuestionIndex].question}
            </label>
            <div className="flex space-x-4 mb-4">
              <label>
                <input
                  type="radio"
                  value="true"
                  checked={questions[currentQuestionIndex].value === "true"}
                  onChange={() => handleChange("true")}
                  className="mr-2"
                  required
                />
                Iya
              </label>
              <label>
                <input
                  type="radio"
                  value="false"
                  checked={questions[currentQuestionIndex].value === "false"}
                  onChange={() => handleChange("false")}
                  className="mr-2"
                  required
                />
                Tidak
              </label>
            </div>
            <button
              onClick={handleNextQuestion}
              className="w-full bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Selanjutnya"
                : "Selesai"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Recommendations</h2>
          <ul className="space-y-4 mt-4">
            {recommendations.map((destination) => (
              <li
                key={destination.id}
                className="border p-4 rounded-md shadow-sm"
              >
                <h3 className="text-lg font-semibold">
                  {destination.destination_name}
                </h3>
                <p>{destination.description}</p>
                <p>Rating: {destination.rating}</p>
                <p>Distance: {destination.distance.toFixed(2)} km</p>
                <p>Ticket Price: {destination.harga_tiket}</p>
                <p>Visitors: {destination.jumlah_pengunjung}</p>
                <img
                  src={destination.image}
                  alt={destination.destination_name}
                  className="w-full h-auto mt-2"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
