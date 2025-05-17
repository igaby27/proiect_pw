import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { get, del } from "../api/api"; // ✅

export default function StergeAutocarPage() {
  const [autocareDisponibile, setAutocareDisponibile] = useState([]);
  const [autocareRezervate, setAutocareRezervate] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/autocare-disponibile")
      .then(async (data) => {
        const verificari = await Promise.all(
          data.map((autocar) =>
            get(`/api/rezervari-pe-autocar/${autocar.idtransport}`).then((hasRez) => ({
              ...autocar,
              rezervat: hasRez === true,
            }))
          )
        );
        setAutocareDisponibile(verificari.filter((a) => !a.rezervat));
        setAutocareRezervate(verificari.filter((a) => a.rezervat));
      })
      .catch(() => setError("Eroare la încărcarea autocarelor."));
  }, []);

  const stergeAutocar = async (idtransport, esteRezervat = false) => {
    try {
      if (esteRezervat) {
        const confirm = window.confirm(
          "⚠️ Acest autocar are rezervări active. Dacă continui, TOATE rezervările vor fi șterse. Continuăm?"
        );
        if (!confirm) return;

        await del(`/api/sterge-rezervari-pe-autocar/${idtransport}`);
      }

      const data = await del(`/api/autocar/${idtransport}`);

      if (data.success) {
        setSuccess("Autocar șters cu succes!");
        setError("");
        setAutocareDisponibile((prev) => prev.filter((a) => a.idtransport !== idtransport));
        setAutocareRezervate((prev) => prev.filter((a) => a.idtransport !== idtransport));
      } else {
        setError(data.message || "Nu s-a putut șterge autocarul.");
      }
    } catch (err) {
      setError("Eroare la conectarea cu serverul.");
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
      <h1 className="mb-4 text-center">Ștergere Autocar</h1>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Autocare disponibile */}
      <div className="mb-5" style={{ width: "100%", maxWidth: "800px" }}>
        <h4 className="text-center mb-3">Autocare disponibile (fără rezervări)</h4>
        {autocareDisponibile.length === 0 ? (
          <p className="text-center">Niciun autocar disponibil.</p>
        ) : (
          autocareDisponibile.map((autocar) => (
            <Row key={autocar.idtransport} className="align-items-center mb-3 border-bottom pb-2">
              <Col>
                {autocar.numar_inmatriculare} – {autocar.plecare_oras} ➔ {autocar.destinatie_oras}
              </Col>
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => stergeAutocar(autocar.idtransport)}
                >
                  Șterge
                </Button>
              </Col>
            </Row>
          ))
        )}
      </div>

      {/* Autocare rezervate */}
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h4 className="text-center mb-3">Autocare rezervate (cu atenționare)</h4>
        {autocareRezervate.length === 0 ? (
          <p className="text-center">Niciun autocar rezervat.</p>
        ) : (
          autocareRezervate.map((autocar) => (
            <Row key={autocar.idtransport} className="align-items-center mb-3 border-bottom pb-2">
              <Col>
                {autocar.numar_inmatriculare} – {autocar.plecare_oras} ➔ {autocar.destinatie_oras}
              </Col>
              <Col xs="auto">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => stergeAutocar(autocar.idtransport, true)}
                >
                  Șterge cu rezervări
                </Button>
              </Col>
            </Row>
          ))
        )}
      </div>

      <Button
        variant="secondary"
        className="mt-5 px-4 py-2 fs-5"
        onClick={() => (window.location.href = "/home-companie")}
      >
        Înapoi
      </Button>
    </Container>
  );
}
