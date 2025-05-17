import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Loader from "./Loader";
import { get } from "../api/api"; // 👈 Wrapper pentru GET global

export default function UserProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [curseleActive, setCurseleActive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.username) return;

    setUsername(user.username);

    get(`/api/users/${user.username}`)
      .then((userData) => {
        setEmail(userData.email);
        setTelefon(userData.telefon);

        if (userData.id) {
          get(`/api/rezervarile-mele?iduser=${userData.id}`)
            .then((rez) => {
              if (Array.isArray(rez)) setCurseleActive(rez);
            })
            .catch(() => console.error("Eroare rezervări"));
        }
      })
      .catch(() => console.error("Eroare utilizator"));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  if (loading) return <Loader />;

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
      <h1 className="mb-4" style={{ fontSize: "3rem" }}>Profil utilizator</h1>
      <h3 className="mb-3" style={{ fontSize: "1.5rem" }}>Bine ai venit, {username}!</h3>

      <p style={{ fontSize: "1.2rem" }}>
        <strong>Email:</strong> {email || "–"} <br />
        <strong>Telefon:</strong> {telefon || "–"}
      </p>

      <h4 className="mt-4">Curse rezervate:</h4>
      {curseleActive.length > 0 ? (
        <Row className="w-100 justify-content-center">
          {curseleActive.map((cursa, index) => (
            <Card key={index} bg="light" text="dark" className="m-2 p-2" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>{cursa.plecare} → {cursa.destinatie}</Card.Title>
                <Card.Text>
                  Data: {new Date(cursa.data_rezervare).toLocaleDateString()}<br />
                  Ora: {cursa.ora_rezervare}<br />
                  Autocar: {cursa.numar_inmatriculare}<br />
                  Locuri: {cursa.numar_locuri}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>
      ) : (
        <p>Nu ai curse rezervate în acest moment.</p>
      )}

      <div className="d-flex gap-3 mt-4">
        <Button variant="success" size="lg" onClick={() => window.history.back()}>
          Înapoi
        </Button>
        <Button variant="danger" size="lg" onClick={handleLogout}>
          Delogare
        </Button>
      </div>
    </Container>
  );
}
