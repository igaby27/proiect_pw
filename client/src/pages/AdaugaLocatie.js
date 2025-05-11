// src/pages/AdaugaLocatie.js
import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function AdaugaLocatie() {
  const [form, setForm] = useState({
    nume: "",
    adresa: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/locatii/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setForm({ nume: "", adresa: "" });
        } else {
          setError("Eroare la salvarea locației.");
        }
      })
      .catch(() => setError("Serverul nu răspunde."));
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
      <h1 className="mb-4">Adaugă Locație</h1>
      {success && <Alert variant="success">Locația a fost salvată cu succes!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form style={{ maxWidth: "600px", width: "100%" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nume locație</Form.Label>
          <Form.Control
            type="text"
            name="nume"
            required
            value={form.nume}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Adresă</Form.Label>
          <Form.Control
            type="text"
            name="adresa"
            required
            value={form.adresa}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-between gap-3">
            <Button
                variant="secondary"
                className="w-50 py-2 fs-5"
                onClick={() => window.history.back()}
            >
                Înapoi
            </Button>
            <Button
                variant="success"
                type="submit"
                className="w-50 py-2 fs-5"
            >
                Salvează locația
            </Button>
        </div>

      </Form>
    </Container>
  );
}
