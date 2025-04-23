import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Loader from "./Loader"; // Importăm loader-ul

export default function UserProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [curseleActive, setCurseleActive] = useState([]);
  const [curseleFinalizate, setCurseleFinalizate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.username) {
      setUsername(user.username);

      // === INTEGRARE BACKEND ===
      // Aici faci request către backend pentru datele utilizatorului
      fetch(`/api/users/${user.username}`)
        .then((res) => res.json())
        .then((data) => {
          setEmail(data.email);
          setTelefon(data.phone);
          setCurseleActive(data.curseleActive || []);
          setCurseleFinalizate(data.curseleFinalizate || []);
        })
        .catch((err) => console.error("Eroare la preluarea profilului:", err));
      // ==========================
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      <h1 className="mb-4" style={{ fontSize: "3rem" }}>
        Profil utilizator
      </h1>
      <h3 className="mb-3" style={{ fontSize: "1.5rem" }}>
        Bine ai venit, {username}!
      </h3>

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
                <Card.Title>{cursa.ruta}</Card.Title>
                <Card.Text>
                  Plecare: {cursa.oraPlecare} <br />
                  Locuri rezervate: {cursa.locuri}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>
      ) : (
        <p>Nu ai curse rezervate în acest moment.</p>
      )}

      <h4 className="mt-5">Curse finalizate:</h4>
      {curseleFinalizate.length > 0 ? (
        <Row className="w-100 justify-content-center">
          {curseleFinalizate.map((cursa, index) => (
            <Card key={index} bg="secondary" text="white" className="m-2 p-2" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>{cursa.ruta}</Card.Title>
                <Card.Text>
                  Plecare: {cursa.oraPlecare} <br />
                  Locuri rezervate: {cursa.locuri}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>
      ) : (
        <p>Nu ai curse finalizate.</p>
      )}

      <Button variant="danger" size="lg" className="mt-4" onClick={handleLogout}>
        Delogare
      </Button>
    </Container>
  );
}
