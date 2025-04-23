import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function StergeCursa() {
  const [curseDisponibile, setCurseDisponibile] = useState([]);
  const [selectedCursa, setSelectedCursa] = useState("");

  useEffect(() => {
    // TODO: Aici se face request către backend pentru a obține doar cursele care NU sunt în desfășurare
    // Exemplu:
    // fetch("/api/curse-de-sters").then(res => res.json()).then(data => setCurseDisponibile(data));
    setCurseDisponibile([
      { id: 1, ruta: "București - Brașov", ora: "10:00" },
      { id: 2, ruta: "Cluj - Sibiu", ora: "14:30" },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Aici se face request către backend pentru a șterge cursa selectată
    // Exemplu:
    // fetch(`/api/sterge-cursa/${selectedCursa}`, { method: "DELETE" });

    alert("Cursa a fost ștearsă cu succes!");
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
                {cursa.ruta} - {cursa.ora}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="danger" className="w-100 py-2 fs-5">
          Șterge Cursa
        </Button>
      </Form>
    </Container>
  );
}
