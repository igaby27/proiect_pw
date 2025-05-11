import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function AdaugaCursa() {
  const [autocareDisponibile, setAutocareDisponibile] = useState([]);
  const [selectedAutocar, setSelectedAutocar] = useState("");
  const [oraPlecare, setOraPlecare] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/autocare-disponibile")
      .then((res) => res.json())
      .then((data) => {
        console.log("Autocare disponibile:", data);
        setAutocareDisponibile(data);
      })
      .catch((err) => console.error("Eroare la încărcarea autocarelor:", err));
  }, []);
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trimite datele către backend pentru a adăuga ora plecării
    fetch("http://localhost:5000/api/adauga-cursa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        autocarId: selectedAutocar,
        oraPlecare,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Cursa a fost adăugată cu succes!");
          window.location.href = "/home-companie";
        } else {
          alert("Eroare la salvarea cursei.");
        }
      })
      .catch(() => alert("Serverul nu răspunde."));
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
              <option key={autocar.idtransport} value={autocar.idtransport}>
                {autocar.numar_inmatriculare} – {autocar.plecare_oras} ➔ {autocar.destinatie_oras}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
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
