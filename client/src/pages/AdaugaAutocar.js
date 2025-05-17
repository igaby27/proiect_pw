import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

export default function AdaugaSiAdministreazaAutocare() {
  const [form, setForm] = useState({
    tip: "",
    numar_locuri: "",
    idplecare: "",
    idsosire: "",
    numar_inmatriculare: "",
  });

  const [locatii, setLocatii] = useState([]);
  const [autocare, setAutocare] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/locatii/all")
      .then((res) => res.json())
      .then((data) => setLocatii(data));

    fetchAutocare();
  }, []);

  const fetchAutocare = () => {
    fetch("http://localhost:5000/api/autocare-disponibile")
      .then((res) => res.json())
      .then((data) => setAutocare(data));
  };

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
          setSuccess(true);
          setForm({
            tip: "",
            numar_locuri: "",
            idplecare: "",
            idsosire: "",
            numar_inmatriculare: "",
          });
          setError("");
          fetchAutocare();
        } else {
          setError("Eroare la salvarea autocarului.");
        }
      })
      .catch(() => setError("Serverul nu răspunde."));
  };

  const handleEdit = (index) => {
    const autocar = autocare[index];
    setEditIndex(index);
    setEditForm({
      ...autocar,
      idplecare: "", // dacă vrei să le poată schimba
      idsosire: "",
    });
  };

  const handleEditSave = (id) => {
    fetch("http://localhost:5000/api/autocar/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, idtransport: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setError("");
          setEditIndex(null);
          fetchAutocare();
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
      <h1 className="mb-4">Administrează Autocare</h1>

      {success && <Alert variant="success" className="w-100 text-center" style={{ maxWidth: "600px" }}>Operațiune efectuată cu succes!</Alert>}
      {error && <Alert variant="danger" className="w-100 text-center" style={{ maxWidth: "600px" }}>{error}</Alert>}

      {/* Formular adăugare */}
      <Form style={{ maxWidth: "600px", width: "100%" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3 text-start">
          <Form.Label>Tip</Form.Label>
          <Form.Control type="text" name="tip" required value={form.tip} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3 text-start">
          <Form.Label>Număr locuri</Form.Label>
          <Form.Control type="number" name="numar_locuri" required value={form.numar_locuri} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3 text-start">
          <Form.Label>Punct plecare</Form.Label>
          <Form.Select name="idplecare" value={form.idplecare} onChange={handleChange} required>
            <option value="">-- selectează --</option>
            {locatii.map((loc) => (
              <option key={loc.idlocatie} value={loc.idlocatie}>{loc.nume} – {loc.adresa}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 text-start">
          <Form.Label>Punct sosire</Form.Label>
          <Form.Select name="idsosire" value={form.idsosire} onChange={handleChange} required>
            <option value="">-- selectează --</option>
            {locatii.map((loc) => (
              <option key={loc.idlocatie} value={loc.idlocatie}>{loc.nume} – {loc.adresa}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4 text-start">
          <Form.Label>Număr înmatriculare</Form.Label>
          <Form.Control type="text" name="numar_inmatriculare" required value={form.numar_inmatriculare} onChange={handleChange} />
        </Form.Group>

        <div className="d-flex justify-content-between gap-3">
          <Button variant="secondary" className="w-50 py-2 fs-5" onClick={() => window.history.back()}>Înapoi</Button>
          <Button type="submit" variant="success" className="w-50 py-2 fs-5">Adaugă Autocar</Button>
        </div>
      </Form>

      {/* Lista autocare */}
      <Card className="mt-5 p-4 bg-transparent shadow text-center" style={{ color: "white", width: "100%", maxWidth: "900px" }}>
        <h4 className="mb-4">Autocare existente</h4>
        {autocare.map((auto, index) => (
          <div key={auto.idtransport} className="mb-3 border-bottom pb-3">
            {editIndex === index ? (
              <>
                <Form.Group className="mb-2 text-start">
                  <Form.Label>Tip</Form.Label>
                  <Form.Control type="text" value={editForm.tip} onChange={(e) => setEditForm({ ...editForm, tip: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-2 text-start">
                  <Form.Label>Număr locuri</Form.Label>
                  <Form.Control type="number" value={editForm.numar_locuri} onChange={(e) => setEditForm({ ...editForm, numar_locuri: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-2 text-start">
                  <Form.Label>Număr înmatriculare</Form.Label>
                  <Form.Control type="text" value={editForm.numar_inmatriculare} onChange={(e) => setEditForm({ ...editForm, numar_inmatriculare: e.target.value })} />
                </Form.Group>
                <div className="d-flex justify-content-center gap-2 mt-2">
                  <Button size="sm" variant="success" onClick={() => handleEditSave(auto.idtransport)}>Salvează</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditIndex(null)}>Anulează</Button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-1"><strong>{auto.numar_inmatriculare}</strong></p>
                <p className="mb-1">{auto.plecare_oras} → {auto.destinatie_oras}</p>
                <p className="mb-1">Locuri: {auto.numar_locuri} | Tip: {auto.tip}</p>
                <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>Modifică</Button>
              </>
            )}
          </div>
        ))}
      </Card>
    </Container>
  );
}
