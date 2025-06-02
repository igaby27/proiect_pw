import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { get, del } from "../api/api";

export default function StergeCursa() {
  const [curse, setCurse] = useState([]);
  const [ruteUnice, setRuteUnice] = useState([]);
  const [rutaSelectata, setRutaSelectata] = useState("");
  const [candidati, setCandidati] = useState([]);
  const [selectedIdora, setSelectedIdora] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/curse-de-sters")
      .then((data) => {
        if (!Array.isArray(data)) {
          setError("Date curse invalide.");
          return;
        }

        setCurse(data);

        const rute = Array.from(
          new Set(data.map((c) => `${c.plecare}→${c.sosire}`))
        );
        setRuteUnice(rute);
      })
      .catch(() => setError("Nu s-au putut încărca cursele."));
  }, []);

  useEffect(() => {
    if (!rutaSelectata) {
      setCandidati([]);
      return;
    }

    const [plecare, sosire] = rutaSelectata.split("→");
    const filtrate = curse.filter(
      (c) => c.plecare === plecare && c.sosire === sosire
    );

    setCandidati(filtrate);
    setSelectedIdora("");
  }, [rutaSelectata, curse]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedIdora) {
      setError("Selectează o dată/oră pentru cursa de șters.");
      return;
    }

    try {
      const data = await del(`/api/sterge-cursa/${selectedIdora}`);
      if (data.success) {
        setSuccess(true);
        setError("");
        setRutaSelectata("");
        setSelectedIdora("");
        setCandidati([]);
        // Reîncarcă lista
        const reloaded = await get("/api/curse-de-sters");
        setCurse(reloaded);
        const rute = Array.from(new Set(reloaded.map((c) => `${c.plecare}→${c.sosire}`)));
        setRuteUnice(rute);
      } else {
        setSuccess(false);
        setError(data.message || "Cursa nu a putut fi ștearsă.");
      }
    } catch {
      setError("Eroare la conectarea cu serverul.");
    }
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
      <h1 className="mb-4">Șterge Cursă</h1>
      {success && <Alert variant="success">Cursa a fost ștearsă cu succes!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} style={{ maxWidth: "500px", width: "100%" }}>
        <Form.Group className="mb-3">
          <Form.Label>Rută</Form.Label>
          <Form.Select
            value={rutaSelectata}
            onChange={(e) => setRutaSelectata(e.target.value)}
            required
          >
            <option value="">-- alege rută --</option>
            {ruteUnice.map((ruta, idx) => (
              <option key={idx} value={ruta}>
                {ruta}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {candidati.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Dată + oră plecare</Form.Label>
            <Form.Select
              value={selectedIdora}
              onChange={(e) => setSelectedIdora(e.target.value)}
              required
            >
              <option value="">-- alege dată + oră --</option>
              {candidati.map((c) => (
                <option key={c.idora} value={c.idora}>
                  {c.data} – {c.ora} ({c.numar_inmatriculare})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <div className="d-flex justify-content-between gap-3 mt-3">
          <Button
            variant="secondary"
            className="w-50 py-2 fs-5"
            onClick={() => window.history.back()}
          >
            Înapoi
          </Button>
          <Button type="submit" variant="danger" className="w-50 py-2 fs-5" disabled={!selectedIdora}>
            Șterge cursa
          </Button>
        </div>
      </Form>
    </Container>
  );
}
