import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { get } from "../api/api"; // ✅ folosește wrapperul din api.js

export default function CursaHartaReal() {
  const [curse, setCurse] = useState([]);
  const [trasee, setTrasee] = useState([]);

  useEffect(() => {
    const fetchCurse = async () => {
      try {
        //const data = await get("/api/curse-in-desfasurare");
        const data = await get("/api/curse-cu-ora");
        setCurse(data);
      } catch (error) {
        console.error("Eroare la obținerea curselor:", error);
      }
    };

    fetchCurse();
  }, []);

  useEffect(() => {
    const fetchTrasee = async () => {
      const KEY = "5b3ce3597851110001cf6248b1264b0e8f754e03968bcf9ee83f9002";

      const traseePromises = curse.map(async (cursa) => {
        try {
          const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            {
              coordinates: [cursa.coordStart, cursa.coordDest],
            },
            {
              headers: {
                Authorization: KEY,
                "Content-Type": "application/json",
              },
            }
          );

          const coords = response.data.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);

          return {
            id: cursa.id,
            traseu: coords,
            start: cursa.coordStart,
            end: cursa.coordDest,
            orasStart: cursa.orasStart,
            orasDestinatie: cursa.orasDestinatie,
          };
        } catch (error) {
          console.error(`Eroare traseu pentru cursa ID ${cursa.id}:`, error);
          return null;
        }
      });

      const rezultate = await Promise.all(traseePromises);
      setTrasee(rezultate.filter(Boolean));
    };

    if (curse.length > 0) {
      fetchTrasee();
    }
  }, [curse]);

  return (
    <MapContainer center={[44.676, 26.07]} zoom={8} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {trasee.map((t) => (
        <div key={t.id}>
          <Polyline positions={t.traseu} pathOptions={{ color: "blue", weight: 5 }} />
          <Marker position={[t.start[1], t.start[0]]}>
            <Popup>{t.orasStart} (Start)</Popup>
          </Marker>
          <Marker position={[t.end[1], t.end[0]]}>
            <Popup>{t.orasDestinatie} (Destinație)</Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}
