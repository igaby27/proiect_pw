import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

export default function RezervareCursaPage() {
  const [selectedCursa, setSelectedCursa] = useState("");
  const [numarLocuri, setNumarLocuri] = useState(1);

  const curse = [
    {
      id: 1,
      autocar: "Autocar 1",
      inmatriculare: "B70CAR",
      ruta: "București - Ploiești",
      oraPlecare: "10:00",
      oraSosire: "11:00",
    },
    {
      id: 2,
      autocar: "Autocar 2",
      inmatriculare: "CJ22BUS",
      ruta: "Cluj - Oradea",
      oraPlecare: "13:00",
      oraSosire: "15:30",
    },
  ];

    const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: trimite datele la backend pentru rezervare

    alert("Rezervarea a fost înregistrată cu succes!");

    // Redirecționare după confirmare
    setTimeout(() => {
        window.location.href = "/home-user";
        }, 500); // 0.5 secunde întârziere
    };

  const cursaSelectata = curse.find((c) => c.id === parseInt(selectedCursa));

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
          <h1 className="text-center mb-4" style={{ fontSize: "2.5rem" }}>Rezervare Cursă</h1>
          <Card className="p-4 bg-transparent shadow" style={{ color: "white" }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "1.2rem" }}>Selectează o cursă</Form.Label>
                <Form.Select
                  value={selectedCursa}
                  onChange={(e) => setSelectedCursa(e.target.value)}
                  required
                >
                  <option value="">Alege o cursă</option>
                  {curse.map((cursa) => (
                    <option key={cursa.id} value={cursa.id}>
                      {cursa.ruta} - {cursa.oraPlecare}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {cursaSelectata && (
                <div className="mb-3" style={{ fontSize: "1.1rem" }}>
                  <strong>Detalii cursă:</strong><br />
                  Autocar: {cursaSelectata.autocar}<br />
                  Nr. Înmatriculare: {cursaSelectata.inmatriculare}<br />
                  Rută: {cursaSelectata.ruta}<br />
                  Ora plecare: {cursaSelectata.oraPlecare}<br />
                  Ora sosire: {cursaSelectata.oraSosire}
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "1.2rem" }}>Număr locuri</Form.Label>
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
