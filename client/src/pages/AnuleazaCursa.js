import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { get, del } from "../api/api";

export default function AnuleazaCursaPage() {
  const [rezervari, setRezervari] = useState([]);
  const [rute, setRute] = useState([]);
  const [rutaSelectata, setRutaSelectata] = useState("");
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user?.username) {
      get(`/api/users/${user.username}`)
        .then((data) => {
          if (data?.id) {
            get(`/api/rezervarile-mele?iduser=${data.id}`)
              .then((rez) => {
                if (Array.isArray(rez)) {
                  setRezervari(rez);

                  // Extrage rute unice: plecare → destinație
                  const ruteUnice = Array.from(
                    new Set(rez.map((r) => `${r.plecare}→${r.destinatie}`))
                  );
                  setRute(ruteUnice);
                }
              })
              .catch((err) => console.error("Eroare rezervări:", err));
          }
        })
        .catch((err) => console.error("Eroare la user:", err));
    }
  }, []);

  const rezervariFiltrate = rezervari.filter(
    (r) => `${r.plecare}→${r.destinatie}` === rutaSelectata
  );

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
            <Form.Label>Alege rută</Form.Label>
            <Form.Select
              value={rutaSelectata}
              onChange={(e) => {
                setRutaSelectata(e.target.value);
                setSelectedId("");
              }}
              required
            >
              <option value="">Selectează rută</option>
              {rute.map((ruta, idx) => (
                <option key={idx} value={ruta}>
                  {ruta}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {rutaSelectata && (
            <Form.Group className="mb-3">
              <Form.Label>Alege rezervarea după dată și oră</Form.Label>
              <Form.Select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                required
              >
                <option value="">Selectează rezervare</option>
                {rezervariFiltrate.map((rez) => (
                  <option key={rez.idrezervare} value={rez.idrezervare}>
                    {rez.data_rezervare} – {rez.ora_rezervare} | {rez.numar_inmatriculare} | {rez.numar_locuri} locuri
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

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
