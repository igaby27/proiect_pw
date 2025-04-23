import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // === INTEGRARE BACKEND ===
      // Înlocuiește acest simulacru cu un apel real către backendul tău
      // Exemplu: const res = await fetch("/api/login", { method: "POST", body: JSON.stringify(credentials) });
      // const data = await res.json();

      const mockResponse = {
        success: true,
        user: {
          username: "Andrei",
          email: credentials.email,
          role: credentials.email.includes("admin") ? "admin" : "user", // simulare rol
          phone: "0712345678",
        },
      };

      if (!mockResponse.success) {
        throw new Error("Date incorecte");
      }

      // Salvăm utilizatorul logat în localStorage
      localStorage.setItem("currentUser", JSON.stringify(mockResponse.user));

      // Redirecționare pe baza rolului
      if (mockResponse.user.role === "admin") {
        window.location.href = "/home-companie";
      } else {
        window.location.href = "/home-user";
      }

      // ============================
    } catch (err) {
      setError("Email sau parolă incorecte.");
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
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Autentifică-te
        </Button>
      </Form>
    </Container>
  );
}
