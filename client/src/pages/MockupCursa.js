import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import axios from "axios";

// Presupunem că backendul returnează o listă de curse în desfășurare cu punctele de start/destinație
// Exemplu de răspuns de la backend:
// [
//   {
//     id: 1,
//     orasStart: "București",
//     coordStart: [26.1025, 44.4268],
//     orasDestinatie: "Ploiești",
//     coordDest: [26.0327, 44.9466]
//   },
//   ...
// ]

export default function CursaHartaReal() {
  const [curse, setCurse] = useState([]); // Lista de curse în desfășurare
  const [trasee, setTrasee] = useState([]); // Lista de rute generate

  useEffect(() => {
    const fetchCurse = async () => {
      try {
        // TODO: Înlocuiește URL-ul cu ruta ta reală de backend pentru curse în desfășurare
        const response = await axios.get("http://localhost:5000/api/curse-in-desfasurare");
        setCurse(response.data); // Setăm lista de curse din backend
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

          const coords = response.data.features[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
          return {
            id: cursa.id,
            traseu: coords,
            start: cursa.coordStart,
            end: cursa.coordDest,
            orasStart: cursa.orasStart,
            orasDestinatie: cursa.orasDestinatie,
          };
        } catch (error) {
          console.error("Eroare la generarea traseului pentru cursa ID " + cursa.id, error);
          return null;
        }
      });

      const rezultate = await Promise.all(traseePromises);
      const traseeValide = rezultate.filter((rez) => rez !== null);
      setTrasee(traseeValide);
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
