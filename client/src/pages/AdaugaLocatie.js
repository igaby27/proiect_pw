import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

export default function AdaugaSiAdministreazaLocatii() {
  const [form, setForm] = useState({ nume: "", adresa: "" });
  const [locatii, setLocatii] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ nume: "", adresa: "" });

  useEffect(() => {
    fetchLocatii();
  }, []);

  const fetchLocatii = () => {
    fetch("http://localhost:5000/api/locatii/all")
      .then((res) => res.json())
      .then((data) => setLocatii(data))
      .catch(() => setError("Eroare la încărcarea locațiilor."));
  };

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
          setError("");
          fetchLocatii();
        } else {
          setError("Eroare la salvarea locației.");
        }
      })
      .catch(() => setError("Serverul nu răspunde."));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm({
      nume: locatii[index].nume,
      adresa: locatii[index].adresa,
    });
  };

  const handleEditSave = (idlocatie) => {
    fetch("http://localhost:5000/api/locatii/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idlocatie,
        nume: editForm.nume,
        adresa: editForm.adresa,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setError("");
          setEditIndex(null);
          fetchLocatii();
        } else {
          setError("Eroare la actualizare.");
        }
      })
      .catch(() => setError("Serverul nu răspunde."));
  };

  return (
    <Container
      className="text-white d-flex flex-column align-items-center justify-content-center text-center"
      fluid
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
      }}
    >
      <h1 className="mb-4">Administrează Locații</h1>

      {success && <Alert variant="success" className="w-100 text-center" style={{ maxWidth: "600px" }}>
        Operațiune efectuată cu succes!
      </Alert>}
      {error && <Alert variant="danger" className="w-100 text-center" style={{ maxWidth: "600px" }}>
        {error}
      </Alert>}

      {/* Formular adăugare */}
      <Form style={{ maxWidth: "600px", width: "100%" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3 text-start">
          <Form.Label>Nume locație</Form.Label>
          <Form.Control
            type="text"
            name="nume"
            required
            value={form.nume}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 text-start">
          <Form.Label>Adresă</Form.Label>
          <Form.Control
            type="text"
            name="adresa"
            required
            value={form.adresa}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100 py-2 fs-5">
          Adaugă locația
        </Button>
      </Form>

      {/* Lista locațiilor pentru modificare */}
      <Card className="mt-5 p-4 bg-transparent shadow text-center" style={{ color: "white", width: "100%", maxWidth: "800px" }}>
        <h4 className="mb-4">Locații existente</h4>
        {locatii.length === 0 ? (
          <p>Nu există locații înregistrate.</p>
        ) : (
          locatii.map((loc, index) => (
            <div key={loc.idlocatie} className="mb-3 border-bottom pb-3">
              {editIndex === index ? (
                <>
                  <Form.Group className="mb-2 text-start">
                    <Form.Label className="fw-bold">Nume locație</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.nume}
                      onChange={(e) => setEditForm({ ...editForm, nume: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2 text-start">
                    <Form.Label className="fw-bold">Adresă</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.adresa}
                      onChange={(e) => setEditForm({ ...editForm, adresa: e.target.value })}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2 justify-content-center mt-2">
                    <Button variant="success" size="sm" onClick={() => handleEditSave(loc.idlocatie)}>
                      Salvează
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditIndex(null)}>
                      Anulează
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1"><strong>{loc.nume}</strong></p>
                  <p className="mb-1">{loc.adresa}</p>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                    Modifică
                  </Button>
                </>
              )}
            </div>
          ))
        )}
      </Card>
    </Container>
  );
}
