import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { get, del } from "../api/api";

export default function StergeCursa() {
  const [curse, setCurse] = useState([]);
  const [ruteUnice, setRuteUnice] = useState([]);
  const [ruteSelectata, setRutaSelectata] = useState("");
  const [dateDisponibile, setDateDisponibile] = useState([]);
  const [selectedIdora, setSelectedIdora] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    get("/api/curse-de-sters")
      .then((data) => {
        setCurse(Array.isArray(data) ? data : []);

        const rute = Array.from(
          new Set(
            data.map(
              (c) => `${c.plecare} → ${c.sosire} | ${c.numar_inmatriculare}`
            )
          )
        );
        setRuteUnice(rute);
      })
      .catch(() => setError("Nu s-au putut încărca cursele."));
  }, []);

  const handleRutaChange = (val) => {
    setRutaSelectata(val);
    setSelectedIdora("");

    const date = curse.filter(
      (c) =>
        `${c.plecare} → ${c.sosire} | ${c.numar_inmatriculare}` === val
    );
    setDateDisponibile(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedIdora) {
      setError("Selectează o dată pentru ruta aleasă.");
      return;
    }

    try {
      const data = await del(`/api/sterge-cursa/${selectedIdora}`);
      if (data.success) {
        setSuccess(true);
        setError("");
        setRutaSelectata("");
        setSelectedIdora("");
        setDateDisponibile([]);

        // reîncarcă
        get("/api/curse-de-sters").then((res) => {
          setCurse(res);
          const rute = Array.from(
            new Set(
              res.map(
                (c) => `${c.plecare} → ${c.sosire} | ${c.numar_inmatriculare}`
              )
            )
          );
          setRuteUnice(rute);
        });
      } else {
        setError(data.message || "Cursa nu a fost ștearsă.");
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
      <h1 className="mb-4">Șterge o Cursă</h1>
      {success && <Alert variant="success">Cursa a fost ștearsă!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px" }}>
        <Form.Group className="mb-3">
          <Form.Label>Rută</Form.Label>
          <Form.Select
            value={ruteSelectata}
            onChange={(e) => handleRutaChange(e.target.value)}
            required
          >
            <option value="">-- alege rută --</option>
            {ruteUnice.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {dateDisponibile.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Dată plecare (pt ruta aleasă)</Form.Label>
            <Form.Select
              value={selectedIdora}
              onChange={(e) => setSelectedIdora(e.target.value)}
              required
            >
              <option value="">-- selectează dată --</option>
              {dateDisponibile.map((d) => (
                <option key={d.idora} value={d.idora}>
                  {d.data} | {d.ora}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <div className="d-flex justify-content-between gap-3">
          <Button
            variant="secondary"
            className="w-50 py-2"
            onClick={() => window.history.back()}
          >
            Înapoi
          </Button>
          <Button type="submit" variant="danger" className="w-50 py-2">
            Șterge cursa
          </Button>
        </div>
      </Form>
    </Container>
  );
}
