import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";

function Results() {
  const [results, setResults] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nomineeDirections, setNomineeDirections] = useState({});

  useEffect(() => {
    // Ambil data dari localStorage
    const storedResults = localStorage.getItem("previousResponse");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }

    // Ambil lokasi pengguna saat ini
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && results) {
      const nomineeDirectionsPromises = results.nomineeDestinations.map((n) => {
        const [lat, lng] = n.longlat.split(",").map(Number);
        return fetchDirections(userLocation, { lat, lng }).then(
          (directions) => ({
            id: n.id,
            directions,
          })
        );
      });

      Promise.all(nomineeDirectionsPromises).then((directionsArray) => {
        const directionsMap = directionsArray.reduce(
          (acc, { id, directions }) => {
            acc[id] = directions;
            return acc;
          },
          {}
        );
        setNomineeDirections(directionsMap);
      });
    }
  }, [userLocation, results]);

  const fetchDirections = async (origin, destination) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=AIzaSyChcunyAdoFI8NlpxlmtPMOyRNI6qfYyVE`
    );
    const data = await response.json();
    if (data.routes.length > 0) {
      return data.routes[0].legs[0];
    }
    return null;
  };

  if (!results || !userLocation) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  // Extract the first nominee as the main recommendation
  const firstNominee = results.nomineeDestinations[0];
  const otherNominees = results.nomineeDestinations.slice(1);

  return (
    <Layout>
      <div className="container mx-auto p-6 pt-32">
        <h1 className="text-center font-bold text-4xl text-slate-700 mb-10">
          Hasil Prediksi
        </h1>

        {/* Main Recommendation */}
        {firstNominee && (
          <div className="bg-white overflow-hidden relative sm:rounded-lg mb-10">
            <div className="h-96 w-full relative">
              <Image
                src={firstNominee.image}
                alt={firstNominee.destination_name}
                className="rounded-3xl object-cover"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div className="bg-white border-2 rounded-3xl p-10 -translate-y-20">
              <div className="flex justify-between mb-10">
                <h1 className="font-bold text-3xl text-slate-700 mb-10">
                  {firstNominee.destination_name}
                </h1>
                <div>
                  <p>{firstNominee.rating} ⭐️ (review)</p>
                </div>
              </div>
              <div>
                <p className="text-lg text-slate-500 mb-10">
                  {firstNominee.description}
                </p>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <div className="border-2 rounded-2xl p-2">
                  <table>
                    <thead>
                      <tr>
                        <th colSpan={3}>
                          <h1 className="font-bold text-xl text-slate-700 mb-5">
                            Detail Data
                          </h1>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-3 py-2 text-md text-slate-500">
                          Harga Masuk
                        </td>
                        <td className="px-3 py-2 text-md text-slate-500">:</td>
                        <td className="px-3 py-2 text-md text-slate-500">
                          <p>Rp. {firstNominee.harga_tiket}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-md text-slate-500">
                          Jumlah pengunjung harian
                        </td>
                        <td className="px-3 py-2 text-md text-slate-500">:</td>
                        <td className="px-3 py-2 text-md text-slate-500">
                          <p>{firstNominee.jumlah_pengunjung}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-md text-slate-500">
                          Jarak
                        </td>
                        <td className="px-3 py-2 text-md text-slate-500">:</td>
                        <td className="px-3 py-2 text-md text-slate-500">
                          <p>
                            {
                              nomineeDirections[firstNominee.id]?.distance.text ||
                              "Loading..."
                            }
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-md text-slate-500">
                          Waktu tempuh
                        </td>
                        <td className="px-3 py-2 text-md text-slate-500">:</td>
                        <td className="px-3 py-2 text-md text-slate-500">
                          <p>
                            {
                              nomineeDirections[firstNominee.id]?.duration.text ||
                              "Loading..."
                            }
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Link href={`/places/${firstNominee.id}`}>
                  <p className="text-[#0E8388] text-center bg-[#CBE4DE] p-3 rounded-lg">
                    Lihat Selengkapnya
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* List of Nominee Destinations */}
        <h2 className="text-center font-bold text-3xl text-slate-700 mb-8">
          Data Komparisasi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[firstNominee, ...otherNominees].map((n, index) => {
            const nomineeDirection = nomineeDirections[n.id];
            const nomineeDistance = nomineeDirection
              ? nomineeDirection.distance.text
              : "Loading...";
            const nomineeDuration = nomineeDirection
              ? nomineeDirection.duration.text
              : "Loading...";

            return (
              <div
                key={index}
                className="bg-white overflow-hidden relative sm:rounded-lg mb-4"
              >
                <div className="h-64 w-full relative">
                  <Image
                    src={n.image}
                    alt={n.destination_name}
                    className="rounded-3xl object-cover"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <div className="bg-white border-2 rounded-3xl p-6 -translate-y-12">
                  <div className="flex justify-between mb-6">
                    <h2 className="font-bold text-xl text-slate-700">
                      {n.destination_name}
                    </h2>
                    <div>
                      <p>{n.rating} ⭐️ (review)</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-md text-slate-500 mb-6">
                      {n.description}
                    </p>
                  </div>

                  <div className="border-2 rounded-lg text-sm">
                    <table>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-3 py-2 text-md text-slate-500">
                            Harga Masuk
                          </td>
                          <td className="px-3 py-2 text-md text-slate-500">:</td>
                          <td className="px-1 py-2 text-md text-slate-500">
                            <p>Rp. {n.harga_tiket}</p>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-md text-slate-500">
                            Jumlah pengunjung harian
                          </td>
                          <td className="px-3 py-2 text-md text-slate-500">:</td>
                          <td className="px-1 py-2 text-md text-slate-500">
                            <p>{n.jumlah_pengunjung}</p>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-md text-slate-500">
                            Jarak
                          </td>
                          <td className="px-3 py-2 text-md text-slate-500">:</td>
                          <td className="px-1 py-2 text-md text-slate-500">
                            <p>{nomineeDistance}</p>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-md text-slate-500">
                            Waktu tempuh
                          </td>
                          <td className="px-3 py-2 text-md text-slate-500">:</td>
                          <td className="px-1 py-2 text-md text-slate-500">
                            <p>{nomineeDuration}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Link href={`/places/${n.id}`}>
                    <p className="text-[#0E8388] text-center bg-[#CBE4DE] p-3 rounded-lg mt-4">
                      Lihat Selengkapnya
                    </p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default Results;
