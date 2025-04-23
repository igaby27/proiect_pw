import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Loader from "./Loader"; // Importăm loader-ul
import CursaHarta from "./MockupCursa"; // asigură-te că path-ul e corect
import "leaflet/dist/leaflet.css";

export default function HomeUser() {
  const [username, setUsername] = useState("");
  const [rezervari, setRezervari] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1000); // Simulăm încărcarea
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.username) {
      setUsername(user.username);
    }

    // TODO: Înlocuiește cu apel backend pentru a obține rezervările utilizatorului curent
    const rezervariSimulate = [
      {
        id: 1,
        autocar: "Autocar 1",
        numarInmatriculare: "B70CAR",
        ruta: "București - Ploiești",
        locuri: 2,
      },
    ];
    setRezervari(rezervariSimulate);
  }, []);

  const handleRedirect1 = () => {
    window.location.href = "/rezerva-cursa";
  };

  const handleRedirect2 = () => {
    window.location.href = "/anuleaza-cursa";
  };

  if (loading) return <Loader />; // Afișăm loader-ul dacă suntem în stare de încărcare

  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
        color: "white",
      }}
    >
      {/* Titlu + username */}
      <Row className="mb-4 justify-content-between align-items-start" style={{ paddingInline: "1rem" }}>
        <Col xs={12} className="text-center">
          <h1 style={{ fontSize: "3rem" }}>Home</h1>
        </Col>
        <Col xs={12} className="text-end mt-2" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          <a href="/user-profile" style={{ color: "white", textDecoration: "underline" }}>
            Logged in as: {username}
          </a>
        </Col>
      </Row>

      {/* Afișare rezervări existente */}
      {rezervari.length > 0 && (
        <Row className="mb-4 px-3">
          <Col>
            <Card className="bg-transparent shadow" style={{ color: "white" }}>
              <Card.Body>
                <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  Rezervările tale
                </Card.Title>
                <Row className="fw-bold border-bottom pb-2">
                  <Col>Autocar</Col>
                  <Col>Nr. înmatriculare</Col>
                  <Col>Rută</Col>
                  <Col>Locuri rezervate</Col>
                </Row>
                {rezervari.map((rez) => (
                  <Row key={rez.id} className="pt-2">
                    <Col>{rez.autocar}</Col>
                    <Col>{rez.numarInmatriculare}</Col>
                    <Col>{rez.ruta}</Col>
                    <Col>{rez.locuri}</Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Salut și butoane */}
      <Row className="mb-4 px-3">
        <Col>
          <h2 style={{ fontSize: "1.5rem" }}>Salut {username}, dorești să rezervi o cursă?</h2>
        </Col>
      </Row>

      <Row className="mb-4 px-3">
        <Col xs={12} md={6} className="mb-3">
          <Button variant="success" className="w-100 py-3 fs-5" onClick={handleRedirect1}>
            Rezervă cursă
          </Button>
        </Col>
        <Col xs={12} md={6}>
          <Button variant="danger" className="w-100 py-3 fs-5" onClick={handleRedirect2}>
            Anulează cursă
          </Button>
        </Col>
      </Row>

      {/* Card cu lista de curse */}
      <Row className="mb-4 px-3">
        <Col>
          <Card className="bg-transparent shadow" style={{ color: "white" }}>
            <Card.Body>
              <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Curse auto - listă</Card.Title>
              <Row className="fw-bold border-bottom pb-2">
                <Col>Autocar</Col>
                <Col>Nr. înmatriculare</Col>
                <Col>Rută</Col>
              </Row>
              <Row className="pt-2">
                <Col>Autocar 1</Col>
                <Col>B70CAR</Col>
                <Col>București - Ploiești</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Text explicativ înainte de hartă */}
      <Row className="mb-2 px-3">
        <Col>
          <h4 style={{ fontWeight: "bold" }}>Vizualizează harta curselor viitoare</h4>
        </Col>
      </Row>

      {/* Iframe cu harta */}
      <Row className="mb-4 px-3">
        <Col>
          <div className="border rounded overflow-hidden shadow" style={{ height: "500px" }}>
            <CursaHarta />
          </div>
        </Col>
      </Row>

      {/* Contact */}
      <Row className="text-center pt-4" style={{ fontSize: "1.1rem" }}>
        <Col>Contact: contact@curseauto.ro | Telefon: 0723 456 789</Col>
      </Row>
    </Container>
  );
}
