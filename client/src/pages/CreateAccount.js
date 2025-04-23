// src/pages/CreateAccount.js
import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    company: "",
    city: "",
    vehicles: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username este obligatoriu";
    if (!formData.email) newErrors.email = "Email-ul este obligatoriu";
    if (!formData.password) newErrors.password = "Parola este obligatorie";
    if (!formData.phone) newErrors.phone = "Numărul de telefon este obligatoriu";

    if (formData.role === "admin") {
      if (!formData.company) newErrors.company = "Numele companiei este obligatoriu";
      if (!formData.city) newErrors.city = "Orașul este obligatoriu";
      if (!formData.vehicles) newErrors.vehicles = "Numărul de vehicule este obligatoriu";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // === INTEGRARE BACKEND ===
      // Trimite datele formData către backend pentru crearea contului
      // fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) })
      //   .then(...)
      // =========================

      localStorage.setItem("currentUser", JSON.stringify({ username: formData.username }));
      window.location.href = "/home-user";
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Număr de telefon</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            isInvalid={!!errors.phone}
          />
          <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <div>
            <Form.Check
              inline
              label="Utilizator"
              name="role"
              type="radio"
              value="user"
              checked={formData.role === "user"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Companie"
              name="role"
              type="radio"
              value="Companie"
              checked={formData.role === "Companie"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        {formData.role === "Companie" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Nume companie</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                isInvalid={!!errors.company}
              />
              <Form.Control.Feedback type="invalid">{errors.company}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Oraș</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                isInvalid={!!errors.city}
              />
              <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Număr inițial de autovehicule</Form.Label>
              <Form.Control
                type="number"
                name="vehicles"
                value={formData.vehicles}
                onChange={handleChange}
                isInvalid={!!errors.vehicles}
              />
              <Form.Control.Feedback type="invalid">{errors.vehicles}</Form.Control.Feedback>
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
