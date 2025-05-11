import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

export default function DeleteAutocarPage() {
  const [autocare, setAutocare] = useState([]);
  const [selected, setSelected] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Obține lista autocarelor disponibile (care nu au o cursă asociată)
  useEffect(() => {
    fetch("http://localhost:5000/api/autocare-disponibile")
      .then((res) => res.json())
      .then((data) => setAutocare(data))
      .catch(() => setError("Nu s-au putut încărca autocarele."));
  }, []);

  // Trimiterea cererii de ștergere
  const handleDelete = (e) => {
    e.preventDefault();

    if (!selected) {
      setError("Te rog selectează un autocar pentru ștergere.");
      return;
    }

    // Trimitere DELETE către backend pentru a șterge autocarul
    fetch(`http://localhost:5000/api/autocar/${selected}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setError(""); // Resetăm mesajul de eroare
          setAutocare((prev) => prev.filter((autocar) => autocar.idtransport !== parseInt(selected))); // Eliminăm autocarul din lista
        } else {
          setSuccess(false);
          setError(data.message || "Autocarul nu a putut fi șters.");
        }
      })
      .catch(() => setError("Eroare la conectarea cu serverul."));
  };

  return (
    <Container
      className="text-white d-flex flex-column align-items-center justify-content-center"
      fluid
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
      }}
    >
      <h1 className="mb-4">Șterge autocar</h1>
      {success && <Alert variant="success">Autocar șters cu succes!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form style={{ maxWidth: "600px", width: "100%" }} onSubmit={handleDelete}>
        <Form.Group className="mb-4">
          <Form.Label>Selectează autocarul</Form.Label>
          <Form.Select
            required
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Selectează...</option>
            {autocare.map((autocar) => (
              <option key={autocar.idtransport} value={autocar.idtransport}>
                {autocar.numar_inmatriculare} – {autocar.plecare_oras} ➔ {autocar.destinatie_oras}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mt-3">


          <Col xs={12} md={6}>
            <Button variant="danger" type="submit" className="w-100 py-2 fs-5">
              Șterge autocar
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button variant="secondary" onClick={() => window.location.href = "/home-companie"} className="w-100 py-2 fs-5">
              Înapoi
            </Button>
          </Col>
        </Row>


        
      </Form>
    </Container>
  );
}
