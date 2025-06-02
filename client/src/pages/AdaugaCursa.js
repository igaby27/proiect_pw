import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { get, post, put } from "../api/api";

export default function AdaugaCursa() {
  const [autocareDisponibile, setAutocareDisponibile] = useState([]);
  const [selectedAutocar, setSelectedAutocar] = useState("");
  const [oraPlecare, setOraPlecare] = useState("");
  const [dataPlecare, setDataPlecare] = useState("");
  const [curseExistente, setCurseExistente] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editOra, setEditOra] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/autocare-disponibile")
      .then(setAutocareDisponibile)
      .catch(() => setError("Eroare la încărcarea autocarelor."));
    
    refreshCurse();
  }, []);

  const refreshCurse = () => {
    get("/api/curse-de-sters")
      .then((data) => setCurseExistente(Array.isArray(data) ? data : []))
      .catch(() => setError("Eroare la încărcarea curselor."));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await post("/api/adauga-cursa", {
        autocarId: selectedAutocar,
        oraPlecare,
        dataPlecare,
      });

      if (data.success) {
        setSuccess(true);
        setSelectedAutocar("");
        setOraPlecare("");
        setDataPlecare("");
        refreshCurse();
      } else {
        setError("Eroare la salvarea cursei.");
      }
    } catch {
      setError("Serverul nu răspunde.");
    }
  };

  const handleEditSave = async (idora) => {
    if (!idora || !editOra) return;

    try {
      const data = await put("/api/cursa/update", { idora, ora: editOra });

      if (data.success) {
        setSuccess(true);
        setEditIndex(null);
        refreshCurse();
      } else {
        setError("Eroare la actualizare oră.");
      }
    } catch {
      setError("Serverul nu răspunde.");
    }
  };

  return (
    <Container
      fluid
      className="text-white d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
      }}
    >
      <h1 className="mb-4">Adaugă / Modifică Cursă</h1>

      {success && (
        <Alert variant="success" style={{ maxWidth: "600px", width: "100%" }}>
          Operațiune reușită!
        </Alert>
      )}
      {error && (
        <Alert variant="danger" style={{ maxWidth: "600px", width: "100%" }}>
          {error}
        </Alert>
      )}

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
        <Form.Group className="mb-3 text-start">
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

        <Form.Group className="mb-3 text-start">
          <Form.Label>Data plecării</Form.Label>
          <Form.Control
            type="date"
            value={dataPlecare}
            onChange={(e) => setDataPlecare(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4 text-start">
          <Form.Label>Ora plecării</Form.Label>
          <Form.Control
            type="time"
            value={oraPlecare}
            onChange={(e) => setOraPlecare(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between gap-3">
          <Button variant="secondary" className="w-50 py-2 fs-5" onClick={() => window.history.back()}>
            Înapoi
          </Button>
          <Button type="submit" variant="success" className="w-50 py-2 fs-5">
            Adaugă Cursă
          </Button>
        </div>
      </Form>

      <Card className="mt-5 p-4 bg-transparent shadow" style={{ color: "white", maxWidth: "800px", width: "100%" }}>
        <h4 className="mb-4 text-center">Curse existente</h4>
        {Array.isArray(curseExistente) && curseExistente.length > 0 ? (
          curseExistente.map((cursa, index) => (
            <div key={cursa.idora || index} className="mb-3 border-bottom pb-3 text-center">
              {editIndex === index ? (
                <>
                  <p className="mb-1 fw-bold">
                    {cursa.numar_inmatriculare} | {cursa.plecare} ➔ {cursa.sosire}
                  </p>
                  <Form.Control
                    type="time"
                    value={editOra}
                    onChange={(e) => setEditOra(e.target.value)}
                    className="mb-2"
                  />
                  <div className="d-flex justify-content-center gap-2">
                    <Button size="sm" variant="success" onClick={() => handleEditSave(cursa.idora)}>
                      Salvează
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditIndex(null)}>
                      Anulează
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1 fw-bold">
                    {cursa.numar_inmatriculare} | {cursa.plecare} ➔ {cursa.sosire}
                  </p>
                  <p>Data: {cursa.data} | Ora: {cursa.ora}</p>
                  <Button size="sm" variant="warning" onClick={() => {
                    setEditIndex(index);
                    setEditOra(cursa.ora);
                  }}>
                    Modifică
                  </Button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">Nu există curse înregistrate.</p>
        )}
      </Card>
    </Container>
  );
}
