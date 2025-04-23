import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

export default function AnuleazaCursaPage() {
  const [rezervari, setRezervari] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    // TODO: Înlocuiește cu apel backend pentru a obține rezervările utilizatorului
    const rezervariSimulate = [
      {
        id: "1",
        autocar: "Autocar 1",
        numarInmatriculare: "B70CAR",
        ruta: "București - Ploiești",
        locuri: 2,
      },
      {
        id: "2",
        autocar: "Autocar 2",
        numarInmatriculare: "AG99BUS",
        ruta: "Pitești - Sibiu",
        locuri: 1,
      },
    ];
    setRezervari(rezervariSimulate);
  }, []);

    const handleSubmit = (e) => {
     e.preventDefault();

    // TODO: trimite cererea de anulare la backend

    alert("Rezervarea a fost anulată cu succes!");

    // Redirecționare după confirmare
  setTimeout(() => {
    window.location.href = "/home-user";
  }, 500); // 0.5 secunde întârziere
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
      <Card className="bg-transparent text-white p-4 shadow-lg" style={{ width: "100%", maxWidth: "600px" }}>
        <Card.Title className="mb-4 text-center" style={{ fontSize: "2rem" }}>
          Anulează o cursă
        </Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Alege o rezervare</Form.Label>
            <Form.Select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Selectează o rezervare</option>
              {rezervari.map((rez) => (
                <option key={rez.id} value={rez.id}>
                  {rez.ruta} | {rez.autocar} | {rez.numarInmatriculare} | {rez.locuri} locuri
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button
            variant="danger"
            type="submit"
            className="w-100 py-2 mt-3"
            disabled={!selectedId}
          >
            Anulează rezervarea
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
