import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { get, post } from "../api/api"; // ✅ Wrapper pentru producție

export default function RezervareCursaPage() {
  const [curseDisponibile, setCurseDisponibile] = useState([]);
  const [rutaSelectata, setRutaSelectata] = useState("");
  const [curse, setCurse] = useState([]);
  const [oraSelectata, setOraSelectata] = useState("");
  const [numarLocuri, setNumarLocuri] = useState(1);
  const [dataSelectata, setDataSelectata] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    get("/api/autocare-cu-ora")
      .then(setCurseDisponibile)
      .catch((err) => console.error("Eroare la încărcarea autocarelor:", err));
  }, []);

  useEffect(() => {
    if (rutaSelectata) {
      get(`/api/ora-plecare-transport/${rutaSelectata}`)
        .then(setCurse)
        .catch((err) => console.error("Eroare la obținerea orelor:", err));
    }
  }, [rutaSelectata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user?.email) {
      alert("Utilizatorul nu este autentificat.");
      return;
    }

    if (!dataSelectata) {
      alert("Te rugăm să selectezi o dată pentru rezervare.");
      return;
    }

    try {
      await post("/api/rezerva", {
        email: user.email,
        idtransport: parseInt(rutaSelectata),
        idora: parseInt(oraSelectata),
        numar_locuri: parseInt(numarLocuri),
        data: dataSelectata,
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/home-user";
      }, 1000);
    } catch (err) {
      console.error("Eroare la rezervare:", err);
      alert("A apărut o eroare la salvarea rezervării.");
    }
  };

  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
        color: "white",
      }}
    >
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8}>
          <h1 className="text-center mb-4" style={{ fontSize: "2.5rem" }}>
            Rezervare Cursă
          </h1>

          <Card className="p-4 bg-transparent shadow" style={{ color: "white" }}>
            {success && <Alert variant="success">Rezervare efectuată cu succes! Redirecționare...</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Rută</Form.Label>
                <Form.Select
                  value={rutaSelectata}
                  onChange={(e) => setRutaSelectata(e.target.value)}
                  required
                >
                  <option value="">Alege ruta</option>
                  {curseDisponibile.map((cursa) => (
                    <option key={cursa.idtransport} value={cursa.idtransport}>
                      {cursa.plecare_oras} - {cursa.destinatie_oras}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ora plecare</Form.Label>
                <Form.Select
                  value={oraSelectata}
                  onChange={(e) => setOraSelectata(e.target.value)}
                  required
                >
                  <option value="">Alege ora</option>
                  {curse.map((c) => (
                    <option key={c.idora} value={c.idora}>
                      {c.ora} - {c.numar_inmatriculare}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data rezervării</Form.Label>
                <Form.Control
                  type="date"
                  value={dataSelectata}
                  onChange={(e) => setDataSelectata(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Număr locuri</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={numarLocuri}
                  onChange={(e) => setNumarLocuri(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="success" className="w-100 py-3 fs-5">
                Confirmă rezervarea
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
