import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loader from "./Loader"; // Importăm loader-ul
import CursaHarta from "./MockupCursa"; // asigură-te că path-ul e corect
import "leaflet/dist/leaflet.css";


export default function HomeCompanie() {
  const [username, setUsername] = useState("");
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
  }, []);

  const handleAutocar = () => {
    // Aici integrezi logica de backend pentru adăugarea/modificarea unui autocar
    // Exemplu: dacă există deja autocarul, îl modifici, altfel îl adaugi
    window.location.href = "/adauga-autocar"; // redirecționează la pagina dedicată
  };

  const handleStergeAutocar = () => {
    // Aici integrezi logica de backend pentru ștergerea unui autocar
    window.location.href = "/sterge-autocar";
  };

  const handleCursa = () => {
    // Aici integrezi logica de backend pentru adăugarea/modificarea unei curse
    // Exemplu: dacă cursa există deja (ex. cu aceleași date), o modifici
    window.location.href = "/adauga-cursa";
  };

  const handleStergeCursa = () => {
    // Aici integrezi logica de backend pentru ștergerea unei curse
    window.location.href = "/sterge-cursa";
  };
  const handleLocatie = () => {
    window.location.href = "/adauga-locatie";
    };
    
  const handleStergeLocatie = () => {
    window.location.href = "/sterge-locatie";
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
      {/* Titlu și username */}
      <Row className="mb-4 justify-content-between align-items-start" style={{ paddingInline: "1rem" }}>
        <Col xs={12} className="text-center">
          <h1 style={{ fontSize: "3rem" }}>Home</h1>
        </Col>
        <Col xs={12} className="text-end mt-2" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          <a href="/user-profile" style={{ color: "white", textDecoration: "underline" }}>
            {username && `Logged in as: ${username}`}
          </a>
        </Col>
      </Row>
      
      
      
      {/* Secțiunea de locații */}
      <Row className="mb-5 px-3">
        <Col>
          <h2 className="mb-3">Gestionare Locații</h2>
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Button
                variant="success"
                className="w-100 py-3 fs-5"
                onClick={handleLocatie}
              >
                Adaugă / Modifică Locație
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button
                variant="danger"
                className="w-100 py-3 fs-5"
                onClick={handleStergeLocatie}
              >
                Șterge Locație
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Secțiunea de autocar */}
      <Row className="mb-5 px-3">
        <Col>
          <h2 className="mb-3">Gestionare Autocare</h2>
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Button
                variant="success"
                className="w-100 py-3 fs-5"
                onClick={handleAutocar}
              >
                Adaugă / Modifică Autocar
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button
                variant="danger"
                className="w-100 py-3 fs-5"
                onClick={handleStergeAutocar}
              >
                Șterge Autocar
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Secțiunea de curse */}
      <Row className="mb-5 px-3">
        <Col>
          <h2 className="mb-3">Gestionare Curse</h2>
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Button
                variant="success"
                className="w-100 py-3 fs-5"
                onClick={handleCursa}
              >
                Adaugă / Modifică Cursă
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button
                variant="danger"
                className="w-100 py-3 fs-5"
                onClick={handleStergeCursa}
              >
                Șterge Cursă
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Hartă */}
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
