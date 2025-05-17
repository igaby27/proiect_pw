// src/pages/CreateAccount.js
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { post } from "../api/api";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    parola: "",
    telefon: "",
    rol: "user",
    companie: "",
    oras: "",
    masini: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username este obligatoriu";
    if (!formData.email) newErrors.email = "Email-ul este obligatoriu";
    if (!formData.parola) newErrors.parola = "Parola este obligatorie";
    if (!formData.telefon) newErrors.telefon = "Numărul de telefon este obligatoriu";

    if (formData.rol === "companie") {
      if (!formData.companie) newErrors.companie = "Numele companiei este obligatoriu";
      if (!formData.oras) newErrors.oras = "Orașul este obligatoriu";
      if (!formData.masini) newErrors.masini = "Numărul de vehicule este obligatoriu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await post("/api/register", formData);
      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify({ username: formData.username, rol: formData.rol }));
        window.location.href = "/home-user";
      } else {
        alert("Eroare la înregistrare.");
      }
    } catch (err) {
      console.error("Eroare:", err);
      alert("Eroare la conectarea cu serverul.");
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
      <h1 className="mb-4">Crează cont nou</h1>
      <Form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Parolă</Form.Label>
          <Form.Control
            type="password"
            name="parola"
            value={formData.parola}
            onChange={handleChange}
            isInvalid={!!errors.parola}
          />
          <Form.Control.Feedback type="invalid">{errors.parola}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Număr de telefon</Form.Label>
          <Form.Control
            type="text"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            isInvalid={!!errors.telefon}
          />
          <Form.Control.Feedback type="invalid">{errors.telefon}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <div>
            <Form.Check
              inline
              label="Utilizator"
              name="rol"
              type="radio"
              value="user"
              checked={formData.rol === "user"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Companie"
              name="rol"
              type="radio"
              value="companie"
              checked={formData.rol === "companie"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        {formData.rol === "companie" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Nume companie</Form.Label>
              <Form.Control
                type="text"
                name="companie"
                value={formData.companie}
                onChange={handleChange}
                isInvalid={!!errors.companie}
              />
              <Form.Control.Feedback type="invalid">{errors.companie}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Oraș</Form.Label>
              <Form.Control
                type="text"
                name="oras"
                value={formData.oras}
                onChange={handleChange}
                isInvalid={!!errors.oras}
              />
              <Form.Control.Feedback type="invalid">{errors.oras}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Număr inițial de autovehicule</Form.Label>
              <Form.Control
                type="number"
                name="masini"
                value={formData.masini}
                onChange={handleChange}
                isInvalid={!!errors.masini}
              />
              <Form.Control.Feedback type="invalid">{errors.masini}</Form.Control.Feedback>
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Creează cont
        </Button>
      </Form>
    </Container>
  );
}
