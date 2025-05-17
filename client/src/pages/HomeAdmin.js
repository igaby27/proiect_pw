import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loader from "./Loader";
import CursaHarta from "./MockupCursa";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

export default function HomeCompanie() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || user.rol !== "companie") {
      navigate("/login");
      return;
    }

    setUsername(user.username);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const redirect = (path) => window.location.href = path;

  if (loading) return <Loader />;

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
      <Row className="mb-4 justify-content-between align-items-start px-3">
        <Col xs={12} className="text-center">
          <h1 style={{ fontSize: "3rem" }}>Home</h1>
        </Col>
        <Col xs={12} className="text-end mt-2" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          <a href="/user-profile" style={{ color: "white", textDecoration: "underline" }}>
            {username && `Logged in as: ${username}`}
          </a>
        </Col>
      </Row>

      {/* Gestionare locații */}
      <Section title="Gestionare Locații" leftBtn="Adaugă / Modifică Locație" rightBtn="Șterge Locație" leftPath="/adauga-locatie" rightPath="/sterge-locatie" redirect={redirect} />

      {/* Gestionare autocare */}
      <Section title="Gestionare Autocare" leftBtn="Adaugă / Modifică Autocar" rightBtn="Șterge Autocar" leftPath="/adauga-autocar" rightPath="/sterge-autocar" redirect={redirect} />

      {/* Gestionare curse */}
      <Section title="Gestionare Curse" leftBtn="Adaugă / Modifică Cursă" rightBtn="Șterge Cursă" leftPath="/adauga-cursa" rightPath="/sterge-cursa" redirect={redirect} />

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

function Section({ title, leftBtn, rightBtn, leftPath, rightPath, redirect }) {
  return (
    <Row className="mb-5 px-3">
      <Col>
        <h2 className="mb-3">{title}</h2>
        <Row>
          <Col xs={12} md={6} className="mb-3">
            <Button variant="success" className="w-100 py-3 fs-5" onClick={() => redirect(leftPath)}>
              {leftBtn}
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button variant="danger" className="w-100 py-3 fs-5" onClick={() => redirect(rightPath)}>
              {rightBtn}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
