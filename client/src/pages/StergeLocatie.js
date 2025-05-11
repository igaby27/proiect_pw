import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function StergeCursa() {
  const [form, setForm] = useState({ nume: "", adresa: "" });
  const [listaCurse, setListaCurse] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Funcție reutilizabilă pentru a încărca lista de curse
  const incarcaCurse = () => {
    fetch("http://localhost:5000/api/locatii")
      .then((res) => res.json())
      .then((data) => setListaCurse(data))
      .catch(() => setError("Nu s-au putut încărca cursele."));
  };

  useEffect(() => {
    incarcaCurse();
  }, []);

  const handleChange = (e) => {
    const [nume, adresa] = e.target.value.split("|");
    setForm({ nume, adresa });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirm = window.confirm(
      `Ești sigur că vrei să ștergi cursa "${form.nume} – ${form.adresa}"?`
    );
    if (!confirm) return;

    fetch("http://localhost:5000/api/locatii/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setError("");
          incarcaCurse(); // actualizează lista
          setForm({ nume: "", adresa: "" }); // resetează formularul
        } else {
          setSuccess(false);
          setError("Cursa nu a fost găsită.");
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
      <h1 className="mb-4">Sterge locatie</h1>
      {success && <Alert variant="success">Locatia a fost stearsa cu succes!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} style={{ maxWidth: "500px", width: "100%" }}>
        <Form.Group className="mb-3">
          <Form.Label>Selectează o locatie</Form.Label>
          <Form.Select
            onChange={handleChange}
            value={form.nume && form.adresa ? `${form.nume}|${form.adresa}` : ""}
            required
          >
            <option value="">-- alege locatia --</option>
            {listaCurse.map((cursa, index) => (
              <option key={index} value={`${cursa.nume}|${cursa.adresa}`}>
                {cursa.nume} – {cursa.adresa}
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
