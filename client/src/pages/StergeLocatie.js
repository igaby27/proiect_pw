import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import { get, del } from "../api/api"; // Wrapper pentru API extern

export default function StergereLocatie() {
  const [folosite, setFolosite] = useState([]);
  const [nefolosite, setNefolosite] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/locatii-status")
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Eroare la încărcare locații.");
          return;
        }

        const f = [];
        const nf = [];

        data.forEach((loc) => {
          loc.este_folosita ? f.push(loc) : nf.push(loc);
        });

        setFolosite(f);
        setNefolosite(nf);
      })
      .catch(() => setError("Eroare la conectarea cu serverul."));
  }, []);

  const stergeLocatie = async (idlocatie, cuRezervari = false) => {
    if (cuRezervari) {
      const confirm = window.confirm(
        "Această locație este folosită. Vor fi șterse și autocarele, cursele și rezervările asociate. Continui?"
      );
      if (!confirm) return;
    }

    try {
      const data = await del(`/api/locatie/delete/${idlocatie}`);
      if (data.success) window.location.reload();
      else setError(data.message || "Eroare la ștergere.");
    } catch {
      setError("Eroare server.");
    }
  };

  return (
    <Container
      fluid
      className="text-white d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
      }}
    >
      <h1 className="mb-4 text-center">Ștergere Locație</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <h4 className="text-center">Locații neutilizate (se pot șterge direct)</h4>
      {nefolosite.length === 0 ? (
        <p className="text-center mb-4">Nicio locație neutilizată.</p>
      ) : (
        <div style={{ width: "100%", maxWidth: "700px" }}>
          {nefolosite.map((loc) => (
            <Row key={loc.idlocatie} className="align-items-center mb-2 border-bottom pb-2">
              <Col>{loc.nume} – {loc.adresa}</Col>
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => stergeLocatie(loc.idlocatie, false)}
                >
                  Șterge
                </Button>
              </Col>
            </Row>
          ))}
        </div>
      )}

      <h4 className="mt-5 text-center">Locații utilizate (cu atenționare)</h4>
      {folosite.length === 0 ? (
        <p className="text-center">Nicio locație utilizată.</p>
      ) : (
        <div style={{ width: "100%", maxWidth: "700px" }}>
          {folosite.map((loc) => (
            <Row key={loc.idlocatie} className="align-items-center mb-2 border-bottom pb-2">
              <Col>{loc.nume} – {loc.adresa}</Col>
              <Col xs="auto">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => stergeLocatie(loc.idlocatie, true)}
                >
                  Șterge cu rezervări
                </Button>
              </Col>
            </Row>
          ))}
        </div>
      )}

      <Button
        variant="secondary"
        className="mt-5 px-5 py-2 fs-5"
        onClick={() => window.history.back()}
      >
        Înapoi
      </Button>
    </Container>
  );
}
