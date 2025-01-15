import Layout from "../elements/Layout";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Alternative({ destinationAlternative }) {
  const criteriaData = [
    { no: 1, name: "Jarak", weight: 0.4, atribut: "Cost" },
    { no: 2, name: "Rating", weight: 0.3, atribut: "Benefit" },
    { no: 3, name: "Harga Tiket", weight: 0.2, atribut: "Cost" },
    { no: 4, name: "Jumlah Pengunjung", weight: 0.1, atribut: "Benefit" },
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Hasil dalam kilometer
  };

  const normalizeData = (data, userLat, userLon) => {
    const distances = data.map((item) => {
      const [destLat, destLon] = item.longlat.split(",").map(Number);
      return calculateDistance(userLat, userLon, destLat, destLon);
    });

    const jarakValues = distances;
    const ratingValues = data.map((d) => d.rating);
    const hargaTiketValues = data.map((d) => parseFloat(d.harga_tiket)); // Pastikan angka
    const jumlahPengunjungValues = data.map((d) => d.jumlah_pengunjung);

    const minHargaTiket = Math.min(...hargaTiketValues.filter((v) => v > 0)); // Cari nilai minimum non-nol

    return data.map((item, index) => ({
      ...item,
      jarak: jarakValues[index],
      normalized: {
        jarak: Math.min(...jarakValues) / jarakValues[index], // Cost
        rating: item.rating / Math.max(...ratingValues), // Benefit
        harga_tiket:
          item.harga_tiket > 0
            ? minHargaTiket / parseFloat(item.harga_tiket) // Pastikan pembagi tidak nol
            : 0, // Jika harga tiket nol, langsung set normalisasi ke 0
        jumlah_pengunjung:
          item.jumlah_pengunjung / Math.max(...jumlahPengunjungValues), // Benefit
      },
    }));
  };

  const [userLocation, setUserLocation] = useState({
    longLat: "",
    placeName: "",
  });

  const calculateFinalScore = (data) => {
    return data.map((item) => {
      const finalScore =
        item.normalized.jarak * criteriaData[0].weight +
        item.normalized.rating * criteriaData[1].weight +
        item.normalized.harga_tiket * criteriaData[2].weight +
        item.normalized.jumlah_pengunjung * criteriaData[3].weight;

      return {
        ...item,
        finalScore,
      };
    });
  };

  const [locationError, setLocationError] = useState(null);
  const [normalizedData, setNormalizedData] = useState([]);

  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({ coords: { latitude, longitude } }) => {
            try {
              const longLat = `${latitude},${longitude}`;
              const placeName = await getPlaceName(latitude, longitude);
              setUserLocation({ longLat, placeName });

              const [userLat, userLon] = [latitude, longitude];
              const normalized = normalizeData(
                destinationAlternative.data,
                userLat,
                userLon,
              );

              const scoredData = calculateFinalScore(normalized);
              setNormalizedData(scoredData);
            } catch (error) {
              setLocationError("Error fetching place name: " + error.message);
            }
          },
          (error) => {
            setLocationError(
              "Error obtaining geolocation: " +
                (error.message || "Unknown error."),
            );
          },
        );
      } else {
        setLocationError("Geolocation is not supported by this browser.");
      }
    };
    /* eslint-disable react-hooks/exhaustive-deps */
    if (typeof window !== "undefined") {
      fetchUserLocation();
    }
  }, []);

  const getPlaceName = async (lat, lng) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      );
      return data.results[0]?.formatted_address || "Lokasi tidak dikenal";
    } catch (error) {
      console.error("Error fetching place name:", error);
      throw new Error("Error fetching location from API.");
    }
  };

  return (
    <Layout>
      <div className="pl-64">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8 pb-[500px]">
          <h1 className="text-center font-bold text-4xl text-slate-700 mb-10 pt-10">
            Alternative
          </h1>
          <div className="bg-gray-100 p-6 mb-10 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Lokasi Anda Saat Ini
            </h2>
            {userLocation.placeName ? (
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Alamat:</span>{" "}
                  {userLocation.placeName}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Koordinat:</span>{" "}
                  {userLocation.longLat}
                </p>
              </div>
            ) : locationError ? (
              <p className="text-red-500">{locationError}</p>
            ) : (
              <div className="flex items-center">
                <p className="text-gray-500 animate-pulse">
                  Mengambil lokasi...
                </p>
              </div>
            )}
          </div>

          {/* Tabel Data Asli */}
          <h2 className="text-xl font-bold text-gray-700 mt-8">Data Asli</h2>
          <table className="min-w-full mt-4">
            <thead className="bg-white border-b text-left">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Alternative</th>
                <th className="px-6 py-4 whitespace-nowrap">Jarak (km)</th>
                <th className="px-6 py-4 whitespace-nowrap">Rating</th>
                <th className="px-6 py-4 whitespace-nowrap">Harga Tiket</th>
                <th className="px-6 py-4 whitespace-nowrap">Jumlah Pengunjung</th>
              </tr>
            </thead>
            <tbody>
              {normalizedData.map((item, index) => (
                <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 border-b"
                        : "bg-white border-b"
                    }
                  >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.destination_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.jarak.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.harga_tiket}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.jumlah_pengunjung}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tabel Normalisasi */}
          <h2 className="text-xl font-bold text-gray-700 mt-8">
            Data Normalisasi
          </h2>
          <table className="min-w-full mt-4">
            <thead className="bg-white border-b text-left">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Alternative</th>
                <th className="px-6 py-4 whitespace-nowrap">Jarak</th>
                <th className="px-6 py-4 whitespace-nowrap">Rating</th>
                <th className="px-6 py-4 whitespace-nowrap">Harga Tiket</th>
                <th className="px-6 py-4 whitespace-nowrap">Jumlah Pengunjung</th>
              </tr>
            </thead>
            <tbody>
              {normalizedData.map((item, index) => (
                <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 border-b"
                        : "bg-white border-b"
                    }
                  >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.destination_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.normalized.jarak.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.normalized.rating.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.normalized.harga_tiket.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.normalized.jumlah_pengunjung.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tabel Skor Akhir */}
          <h2 className="text-xl font-bold text-gray-700 mt-8">Skor Akhir</h2>
          <table className="min-w-full mt-4">
            <thead className="bg-white border-b text-left">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Ranking</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Alternative</th>
                <th className="px-6 py-4 whitespace-nowrap">Skor Akhir</th>
              </tr>
            </thead>
            <tbody>
              {normalizedData
                .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0)) // Mengurutkan berdasarkan Skor Akhir terbesar
                .map((item, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 border-b"
                        : "bg-white border-b"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.destination_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.finalScore ? item.finalScore.toFixed(2) : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SPK_API}api/destination/alternative`,
  );
  const destinationAlternative = await res.json();

  return { props: { destinationAlternative } };
}
