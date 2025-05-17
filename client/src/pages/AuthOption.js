import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

// Loader component
const Loader = () => (
  <div
    style={{
      height: "100vh",
      background: "linear-gradient(to bottom, #007bff, #000)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Spinner animation="border" variant="light" />
  </div>
);

export default function AuthOptionsPage() {
  const [loading, setLoading] = useState(true);

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
      <h1 className="mb-5 text-center" style={{ fontSize: "3rem" }}>
        Bine ai venit!
      </h1>

      <Row className="w-100" style={{ maxWidth: "600px" }}>
        <Col xs={12} md={6} className="mb-4">
          <Button
            variant="primary"
            className="w-100 py-3 fs-5"
            href="/login"
          >
            Login
          </Button>
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <Button
            variant="secondary"
            className="w-100 py-3 fs-5"
            href="/register"
          >
            Creează cont
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
