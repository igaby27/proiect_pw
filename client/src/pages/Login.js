import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { post } from "../api/api"; // ✅ importă metoda POST

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", parola: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await post("/api/login", credentials); // ✅ folosește post() în loc de fetch

      if (!data.success) throw new Error("Date incorecte");

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      if (data.user.rol === "companie") {
        window.location.href = "/home-companie";
      } else {
        window.location.href = "/home-user";
      }
    } catch (err) {
      setError("Email sau parolă incorecte.");
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register";
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
      <h1 className="mb-4">Autentificare</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Parolă</Form.Label>
          <Form.Control
            type="password"
            name="parola"
            value={credentials.parola}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Autentifică-te
        </Button>

        <Button
          variant="outline-light"
          onClick={handleRegisterRedirect}
          className="w-100 mt-3"
        >
          Creează un cont nou
        </Button>
      </Form>
    </Container>
  );
}
