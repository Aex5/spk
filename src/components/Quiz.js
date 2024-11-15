import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const questionsData = [
  {
    type: "distance",
    question: "Apakah Anda ingin destinasi yang dekat?",
    value: "",
  },
  {
    type: "rating",
    question: "Seberapa penting rating destinasi bagi Anda?",
    value: "",
  },
  {
    type: "harga_tiket",
    question: "Apakah Anda mencari harga tiket murah?",
    value: "",
  },
  {
    type: "jumlah_pengunjung",
    question: "Apakah Anda ingin destinasi yang ramai?",
    value: "",
  },
];

export default function Quiz() {
  const router = useRouter();
  const [questions, setQuestions] = useState(questionsData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userLocation, setUserLocation] = useState({
    longLat: "",
    placeName: "",
  });
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Pastikan kode hanya berjalan di klien
    if (typeof window !== "undefined") {
      fetchUserLocation();
    }
  }, []);

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          const longLat = `${latitude},${longitude}`;
          const placeName = await getPlaceName(latitude, longitude);
          setUserLocation({ longLat, placeName });
        },
        (error) => console.error("Error obtaining geolocation: ", error),
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const getPlaceName = async (lat, lng) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      );
      return data.results[0]?.formatted_address || "Lokasi tidak dikenal";
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Error fetching location";
    }
  };

  const handleChange = (value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, index) =>
        index === currentQuestionIndex ? { ...q, value } : q,
      ),
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const requestData = {
      preferences: questions,
      userLongLat: userLocation.longLat,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/predict",
        requestData,
      );
      localStorage.setItem("previousResponse", JSON.stringify(data));

      if (data.status === "success") {
        toast.success("Prediction successful!");
        router.push("/places/result");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error fetching recommendations");
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Rekomendasi Wisata</h1>
      <LocationDisplay userLocation={userLocation} />

      {!quizStarted ? (
        <StartQuizButton onStart={() => setQuizStarted(true)} />
      ) : (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          onChange={handleChange}
          onNext={handleNext}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          loading={loading}
        />
      )}

      {loading && <p className="text-blue-500 mt-4">Loading...</p>}
    </div>
  );
}

const LocationDisplay = ({ userLocation }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Lokasi Anda
    </label>
    <input
      type="text"
      value={userLocation.placeName}
      readOnly
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
      placeholder="Fetching your location..."
    />
  </div>
);

const StartQuizButton = ({ onStart }) => (
  <button
    onClick={onStart}
    className="w-full bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600"
  >
    Cari Rekomendasi
  </button>
);

const QuestionCard = ({
  question,
  onChange,
  onNext,
  isLastQuestion,
  loading,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
      <p className="text-sm font-medium text-gray-700 mb-4">
        {question.question}
      </p>
      <div className="flex space-x-4 mb-4">
        <label>
          <input
            type="radio"
            value="true"
            checked={question.value === "true"}
            onChange={() => onChange("true")}
            className="mr-2"
          />
          Iya
        </label>
        <label>
          <input
            type="radio"
            value="false"
            checked={question.value === "false"}
            onChange={() => onChange("false")}
            className="mr-2"
          />
          Tidak
        </label>
      </div>
      <button
        onClick={onNext}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {isLastQuestion ? "Selesai" : "Selanjutnya"}
      </button>
    </div>
  </div>
);

