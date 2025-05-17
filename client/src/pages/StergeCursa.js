import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function StergeCursa() {
  const [curse, setCurse] = useState([]);
  const [selectedIdora, setSelectedIdora] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const incarcaCurse = () => {
    fetch("http://localhost:5000/api/curse-de-sters")
      .then((res) => res.json())
      .then((data) => setCurse(Array.isArray(data) ? data : []))
      .catch(() => setError("Nu s-au putut încărca cursele."));
  };

  useEffect(() => {
    incarcaCurse();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedIdora) {
      setError("Selectează o cursă.");
      return;
    }

    fetch(`http://localhost:5000/api/sterge-cursa/${selectedIdora}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setError("");
          incarcaCurse();
          setSelectedIdora("");
        } else {
          setSuccess(false);
          setError(data.message || "Cursa nu a fost ștearsă.");
        }
      })
      .catch(() => setError("Eroare la conectarea cu serverul."));
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center text-white"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
      }}
    >
      <h1 className="mb-4">Șterge Cursă</h1>
      {success && <Alert variant="success">Cursa a fost ștearsă cu succes!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} style={{ maxWidth: "500px", width: "100%" }}>
        <Form.Group className="mb-3">
          <Form.Label>Selectează o cursă</Form.Label>
          <Form.Select
            value={selectedIdora}
            onChange={(e) => setSelectedIdora(e.target.value)}
            required
          >
            <option value="">-- alege cursa --</option>
            {curse.map((c) => (
              <option key={c.idora} value={c.idora}>
                {c.plecare} – {c.sosire} ({c.ora})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-between gap-3">
          <Button
            variant="secondary"
            className="w-50 py-2 fs-5"
            onClick={() => window.history.back()}
          >
            Înapoi
          </Button>
          <Button type="submit" variant="danger" className="w-50 py-2 fs-5">
            Șterge cursa
          </Button>
        </div>
      </Form>
    </Container>
  );
}
