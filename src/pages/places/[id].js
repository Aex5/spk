import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Layout from "@/components/Layout";
import Link from "next/link";
import useSWR from "swr";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import ReactDOMServer from "react-dom/server";
import { IoPersonCircle } from "react-icons/io5";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const fetcher = (url) => fetch(url).then((res) => res.json());

// Dynamic imports for components
const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const DynamicTileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const DynamicMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const DynamicPopup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false },
);

// Helper function to create custom icons
const createCustomIcon = (IconComponent) => {
  if (typeof window !== "undefined") {
    return L.divIcon({
      html: ReactDOMServer.renderToString(
        <IconComponent className="text-red-600 text-2xl" />,
      ),
      className: "custom-marker-icon",
      iconSize: [25, 25],
    });
  }
  return null;
};

// Component for handling the Place Detail page
function PlaceDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [place, setPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    user_id: "",
    destination_id: "",
    comment: "",
  });
  const [mapReady, setMapReady] = useState(false);

  // Fetch user and place data when available
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }

    if (id) {
      setData((prevData) => ({ ...prevData, destination_id: id }));
    }
    setMapReady(true);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/destination/detail/${id}`)
        .then((response) => response.json())
        .then((data) => setPlace(data));
    }
  }, [id]);

  // Fetch comments using SWR
  const { data: comments, mutate } = useSWR(
    id ? `http://localhost:3001/api/destination/${id}/comments` : null,
    fetcher,
  );

  // Handle user location using geolocation
  useEffect(() => {
    if (mapReady && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting user location:", error),
      );
    }
  }, [mapReady]);

  // Form submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("User is not logged in.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/destination/${id}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await res.json();
      if (result.status === "success") {
        toast.success("Comment added!");
        mutate(); // Fetch comments again
        setData((prevData) => ({ ...prevData, comment: "" }));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while posting comment.");
    }
  };

  const formHandler = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // If data is not loaded yet
  if (!place || !userLocation) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const destination = place.data[0].longlat.split(",").map(Number);
  const destinationLatLng = { lat: destination[0], lng: destination[1] };

  const createRoutingMachineLayer = () => {
    if (userLocation) {
      const instance = L.Routing.control({
        waypoints: [
          L.latLng(destinationLatLng.lat, destinationLatLng.lng),
          L.latLng(userLocation.lat, userLocation.lng),
        ],
        lineOptions: { styles: [{ color: "#6FA1EC", weight: 4 }] },
        show: false,
        addWaypoints: false,
        routeWhileDragging: true,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null,
      });

      return instance;
    }

    return null;
  };
  const RoutingMachine = createControlComponent(createRoutingMachineLayer);

  // Custom Icons for Destination and User
  const destinationIcon = createCustomIcon(() => (
    <Image src="/map-pin.png" width={20} height={20} alt="map pin" />
  ));
  const userIcon = createCustomIcon(() => (
    <IoPersonCircle className="text-2xl" />
  ));

  return (
    <Layout>
      <div className="container max-w-[1100px] mx-auto pt-32">
        {place.data.map((p) => (
          <div key={p.destination_name}>
            <div className="bg-white overflow-hidden relative sm:rounded-lg mb-4">
              <div className="h-96 w-full relative">
                <Image
                  src={p.image}
                  alt={p.destination_name}
                  className="rounded-3xl object-cover"
                  layout="fill"
                />
              </div>
              <div className="py-10">
                <h1 className="font-bold text-4xl text-slate-700 mb-10">
                  {p.destination_name}
                </h1>
                <p className="text-lg text-slate-500 mb-10">{p.description}</p>
                <p>Rating: {p.rating} ⭐️</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mb-10 h-96">
          {mapReady && (
            <DynamicMapContainer
              center={destinationLatLng}
              zoom={13}
              scrollWheelZoom={true}
              className="h-full"
            >
              <DynamicTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <DynamicMarker
                position={destinationLatLng}
                icon={destinationIcon}
              >
                <DynamicPopup>{`Destination: ${place.data[0].destination_name}`}</DynamicPopup>
              </DynamicMarker>
              {userLocation && (
                <DynamicMarker position={userLocation} icon={userIcon}>
                  <DynamicPopup>Your Location</DynamicPopup>
                </DynamicMarker>
              )}
              <RoutingMachine />z
            </DynamicMapContainer>
          )}
        </div>

        <div className="mb-10">
          {comments?.status === "success" && comments.data.length > 0 ? (
            comments.data.map((comment, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-5 bg-white p-4 rounded-xl border border-gray-300">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div>
                    <h5 className="text-slate-700 font-semibold text-lg">
                      {comment.username || "Anonymous"}
                    </h5>
                    <p className="text-xs text-slate-400 mb-5">
                      {new Date(comment.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-slate-500">{comment.comment}</p>
                    <p className="text-slate-500">{comment.destination_name}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Belum ada komentar</p>
          )}

          {user ? (
            <form onSubmit={submitHandler} className="mb-10">
              <textarea
                name="comment"
                id="comment"
                cols="30"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Tulis komentar..."
                value={data.comment}
                onChange={formHandler}
              ></textarea>
              <button
                type="submit"
                className="bg-slate-600 text-white px-4 py-2 rounded-md mt-2"
              >
                Kirim Komentar
              </button>
            </form>
          ) : (
            <div className="mb-10">
              <div className="w-full h-20 p-5 border border-gray-300 rounded-md">
                <p className="text-gray-400 italic">Login terlebih dahulu </p>
              </div>
              <Link
                href={"/auth/login"}
                className="bg-slate-600 text-white px-4 py-2 rounded-md mt-2 inline-block"
              >
                login
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default PlaceDetail;
