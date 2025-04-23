import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function AddAutocarPage() {
  const [form, setForm] = useState({
    inmatriculare: "",
    ruta: "",
    locuri: "",
    oraPlecare: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // AICI se face POST către backend pentru salvarea autocarului
    // Exemplu: axios.post("/api/auto/add", form)
    alert("Autocar adăugat cu succes!");
    window.location.href = "/home-companie"; // redirecționare după adăugare
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
      <h1 className="mb-4">Adaugă autocar</h1>
      <Form style={{ maxWidth: "600px", width: "100%" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Număr înmatriculare</Form.Label>
          <Form.Control
            type="text"
            name="inmatriculare"
            required
            value={form.inmatriculare}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Număr total locuri</Form.Label>
          <Form.Control
            type="number"
            name="locuri"
            required
            value={form.locuri}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Button variant="success" type="submit" className="w-100 py-2 fs-5">
          Adaugă autocar
        </Button>
      </Form>
    </Container>
  );
}
