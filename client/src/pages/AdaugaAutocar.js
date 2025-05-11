import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function AdaugaAutocar() {
  const [form, setForm] = useState({
    tip: "",
    numar_locuri: "",
    idplecare: "",
    idsosire: "",
    numar_inmatriculare: "",
  });

  const [locatii, setLocatii] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/locatii/all")
      .then((res) => res.json())
      .then((data) => setLocatii(data))
      .catch((err) => console.error("Eroare la încărcarea locațiilor:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/autocar/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Autocar adăugat cu succes!");
          window.location.href = "/home-companie";
        } else {
          alert("Eroare la salvarea autocarului.");
        }
      })
      .catch(() => alert("Serverul nu răspunde."));
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
      <h1 className="mb-4">Adaugă Autocar</h1>
      <Form style={{ maxWidth: "600px", width: "100%" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tip</Form.Label>
          <Form.Control
            type="text"
            name="tip"
            required
            value={form.tip}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Număr locuri</Form.Label>
          <Form.Control
            type="number"
            name="numar_locuri"
            required
            value={form.numar_locuri}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Punct plecare</Form.Label>
          <Form.Select name="idplecare" value={form.idplecare} onChange={handleChange} required>
            <option value="">-- selectează locația --</option>
            {locatii.map((loc) => (
              <option key={loc.idlocatie} value={loc.idlocatie}>
                {loc.nume} – {loc.adresa}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Punct sosire</Form.Label>
          <Form.Select name="idsosire" value={form.idsosire} onChange={handleChange} required>
            <option value="">-- selectează locația --</option>
            {locatii.map((loc) => (
              <option key={loc.idlocatie} value={loc.idlocatie}>
                {loc.nume} – {loc.adresa}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

      

        <Form.Group className="mb-4">
          <Form.Label>Număr înmatriculare</Form.Label>
          <Form.Control
            type="text"
            name="numar_inmatriculare"
            required
            value={form.numar_inmatriculare}
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
          <Button type="submit" variant="success" className="w-50 py-2 fs-5">
            Adaugă Autocar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
