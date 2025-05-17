import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { get, del } from "../api/api";

export default function AnuleazaCursaPage() {
  const [rezervari, setRezervari] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user?.username) {
      get(`/api/users/${user.username}`)
        .then(data => {
          if (data?.id) {
            get(`/api/rezervarile-mele?iduser=${data.id}`)
              .then(rez => {
                setRezervari(Array.isArray(rez) ? rez : []);
              })
              .catch(err => console.error("Eroare rezervări:", err));
          }
        })
        .catch(err => console.error("Eroare la user:", err));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await del(`/api/sterge-rezervare/${selectedId}`);

      if (data.success) {
        alert("Rezervarea a fost anulată cu succes!");
        setTimeout(() => {
          window.location.href = "/home-user";
        }, 500);
      } else {
        alert("Eroare: " + data.message);
      }
    } catch (err) {
      console.error("Eroare la ștergere:", err);
      alert("Eroare la trimiterea cererii de anulare.");
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
              required
            >
              <option value="">Selectează o rezervare</option>
              {rezervari.map((rez) => (
                <option key={rez.idrezervare} value={rez.idrezervare}>
                  {rez.plecare} → {rez.destinatie} | {rez.numar_inmatriculare} | {rez.ora_rezervare} | {rez.numar_locuri} locuri
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
