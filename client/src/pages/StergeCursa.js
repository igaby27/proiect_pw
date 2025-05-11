import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

export default function StergeCursa() {
  const [curseDisponibile, setCurseDisponibile] = useState([]);
  const [selectedCursa, setSelectedCursa] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchCurse = () => {
    fetch("http://localhost:5000/api/curse-de-sters")
      .then((res) => res.json())
      .then((data) => {
        setCurseDisponibile(data);
        if (data.length === 0) setSelectedCursa("");
      })
      .catch(() => setError("Nu s-au putut încărca cursele."));
  };

  useEffect(() => {
    fetchCurse();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCursa) {
      setError("Te rog selectează o cursă pentru ștergere.");
      return;
    }

    fetch(`http://localhost:5000/api/sterge-cursa/${selectedCursa}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setError("");
          setSelectedCursa("");
          fetchCurse(); // 🔄 Refresh lista după ștergere
        } else {
          setSuccess(false);
          setError(data.message || "Cursa nu a putut fi ștearsă.");
        }
      })
      .catch(() => setError("Eroare la conectarea cu serverul."));
  };

  const handleBack = () => {
    window.location.href = "/home-companie";
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center text-white"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
      }}
    >
      <Form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "2rem",
          borderRadius: "1rem",
        }}
      >
        <h2 className="mb-4 text-center">Șterge Cursă</h2>

        {success && <Alert variant="success">Cursa a fost ștearsă cu succes!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-4">
          <Form.Label>Selectează cursa de șters</Form.Label>
          <Form.Select
            value={selectedCursa}
            onChange={(e) => setSelectedCursa(e.target.value)}
            required
          >
            <option value="">Alege o cursă</option>
            {curseDisponibile.map((cursa) => (
              <option key={cursa.id} value={cursa.id}>
                {cursa.plecare} – {cursa.sosire} ({cursa.ora || "fără oră"})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row>
          <Col xs={12} md={6}>
            <Button variant="danger" type="submit" className="w-100 py-2 fs-5 mb-2">
              Șterge Cursa
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button variant="secondary" onClick={handleBack} className="w-100 py-2 fs-5 mb-2">
              Înapoi
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
