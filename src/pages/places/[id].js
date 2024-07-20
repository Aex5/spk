import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

function PlaceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [place, setPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fetch the place details using the id
    if (id) {
      fetch(`http://localhost:3001/api/destination/detail/${id}`)
        .then((response) => response.json())
        .then((data) => setPlace(data));
    }
  }, [id]);

  useEffect(() => {
    // Get the user's current location
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
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!place || !userLocation) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {place.data.map((p) => {
        return (
          <div key={p.destination_name}>
            <h1 className="text-center font-bold text-4xl text-slate-700 mb-10">
              {p.destination_name}
            </h1>
            <div className="bg-white overflow-hidden relative sm:rounded-lg mb-4">
              <div className="h-96 w-full relative">
                <Image
                  src={p.image}
                  alt={p.destination_name}
                  className="rounded-3xl object-cover"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="bg-white border-2 rounded-3xl p-10">
                <p className="text-lg text-slate-500 mb-10">{p.description}</p>
                <p>Rating: {p.rating} ⭐️</p>
              </div>
            </div>
          </div>
        );
      })}
      <div>
        <APIProvider apiKey="AIzaSyChcunyAdoFI8NlpxlmtPMOyRNI6qfYyVE">
          <div className="flex">
            <Map
              style={{ width: "50%", height: "500px" }}
              defaultCenter={{ lat: 40.712776, lng: -74.005974 }} // New York City
              defaultZoom={10}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            ></Map>
            <Directions
              origin={userLocation}
              destination={place.data[0].longlat}
            />
          </div>
        </APIProvider>
      </div>
    </div>
  );
}

function Directions({ origin, destination }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination)
      return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, origin, destination]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="directions">
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      {/* <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <button onClick={() => setRouteIndex(index)}>
              {route.summary}
            </button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default PlaceDetail;
