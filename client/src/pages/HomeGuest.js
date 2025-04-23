import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loader from "./Loader"; // Importăm loader-ul
import CursaHarta from "./MockupCursa"; // asigură-te că path-ul e corect
import "leaflet/dist/leaflet.css";


export default function HomeGuest() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulăm încărcarea
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />; // Afișăm loader-ul dacă suntem în stare de încărcare

  const handleRedirect = () => {
    window.location.href = "/AuthOption";
  };

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
      {/* Titlu */}
      <Row className="mb-4 justify-content-center text-center">
        <Col xs={12}>
          <h1 style={{ fontSize: "3rem" }}>Home</h1>
        </Col>
      </Row>
      <Row className="justify-content-between align-items-center mb-3 px-3">
        <Col xs={12} md={6}></Col>
        <Col xs={12} md={6} className="text-end">
        <a href="/AuthOption" style={{ color: "white", textDecoration: "underline", fontSize: "1.2rem", fontWeight: "bold", color: "white"}}>
          Not logged in
        </a>
        </Col>
      </Row>
      {/* Mesaj + butoane */}
      <Row className="mb-4 justify-content-center text-center px-3">
        <Col xs={12}>
          <h2 style={{ fontSize: "1.5rem" }}>Salut, dorești să rezervi o cursă?</h2>
        </Col>
      </Row>

      <Row className="mb-4 justify-content-center px-3">
        <Col xs={12} md={6} className="mb-3">
          <Button
            variant="success"
            className="w-100 py-3 fs-5"
            onClick={handleRedirect}
          >
            Rezervă cursă
          </Button>
        </Col>
        <Col xs={12} md={6}>
          <Button
            variant="danger"
            className="w-100 py-3 fs-5"
            onClick={handleRedirect}
          >
            Anulează cursă
          </Button>
        </Col>
      </Row>

      {/* Listă curse */}
      <Row className="mb-4 px-3">
        <Col>
          <div
            className="bg-transparent shadow rounded p-3"
            style={{ color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="fw-bold mb-3">Curse disponibile</h3>
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
          </div>
        </Col>
      </Row>

      {/* Text explicativ + hartă */}
      <Row className="mb-2 px-3">
        <Col>
          <h4 style={{ fontWeight: "bold" }}>Vizualizează harta curselor viitoare</h4>
        </Col>
      </Row>

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
