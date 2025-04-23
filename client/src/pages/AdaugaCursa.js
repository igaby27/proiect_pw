import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function AdaugaCursa() {
  const [autocareDisponibile, setAutocareDisponibile] = useState([]);
  const [selectedAutocar, setSelectedAutocar] = useState("");
  const [plecare, setPlecare] = useState("");
  const [destinatie, setDestinatie] = useState("");
  const [oraPlecare, setOraPlecare] = useState("");

  useEffect(() => {
    // TODO: Aici se face request către backend pentru a obține autocarele care NU au deja o cursă asociată
    // Exemplu:
    // fetch("/api/autocare-disponibile").then(res => res.json()).then(data => setAutocareDisponibile(data));
    setAutocareDisponibile([
      { id: 1, nrInmatriculare: "B70CAR" },
      { id: 2, nrInmatriculare: "CJ20BUS" },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Aici se trimite către backend datele despre noua cursă
    // Exemplu:
    // fetch("/api/adauga-cursa", {
    //   method: "POST",
    //   body: JSON.stringify({ autocarId: selectedAutocar, plecare, destinatie, oraPlecare }),
    //   headers: { "Content-Type": "application/json" }
    // });

    alert("Cursa a fost adăugată cu succes!");
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
        <h2 className="mb-4 text-center">Adaugă Cursă</h2>

        <Form.Group className="mb-3">
          <Form.Label>Autocar disponibil</Form.Label>
          <Form.Select
            value={selectedAutocar}
            onChange={(e) => setSelectedAutocar(e.target.value)}
            required
          >
            <option value="">Selectează un autocar</option>
            {autocareDisponibile.map((autocar) => (
              <option key={autocar.id} value={autocar.id}>
                {autocar.nrInmatriculare}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Oraș de plecare</Form.Label>
          <Form.Control
            type="text"
            value={plecare}
            onChange={(e) => setPlecare(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Destinație</Form.Label>
          <Form.Control
            type="text"
            value={destinatie}
            onChange={(e) => setDestinatie(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Ora plecării</Form.Label>
          <Form.Control
            type="time"
            value={oraPlecare}
            onChange={(e) => setOraPlecare(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success" className="w-100 py-2 fs-5">
          Adaugă Cursă
        </Button>
      </Form>
    </Container>
  );
}
