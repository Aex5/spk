import L from 'leaflet';

const CustomMapIcon = () => {
  const icon = new L.Icon({
    iconUrl: '/map-pin.png',
    iconSize: [30, 30], 
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return icon;
};

export default CustomMapIcon;
