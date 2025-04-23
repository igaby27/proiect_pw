import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function DeleteAutocarPage() {
  const [autocare, setAutocare] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // AICI se face GET către backend pentru a obține lista autocarelor
    // Exemplu: axios.get("/api/auto/list").then(res => setAutocare(res.data))
    
    // Exemplu static temporar:
    setAutocare([
      { id: 1, inmatriculare: "B70CAR", ruta: "București - Ploiești" },
      { id: 2, inmatriculare: "CJ23XYZ", ruta: "Cluj - Oradea" },
    ]);
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();

    // AICI se face DELETE către backend
    // Exemplu: axios.delete(`/api/auto/delete/${selected}`)

    alert("Autocar șters cu succes!");
    window.location.href = "/home-companie";
  };

  return (
    <Container
      className="text-white d-flex flex-column align-items-center justify-content-center"
      fluid
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #007bff, #000)",
        padding: "2rem",
      }}
    >
      <h1 className="mb-4">Șterge autocar</h1>
      <Form style={{ maxWidth: "600px", width: "100%" }} onSubmit={handleDelete}>
        <Form.Group className="mb-4">
          <Form.Label>Selectează autocarul</Form.Label>
          <Form.Select
            required
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Selectează...</option>
            {autocare.map((autocar) => (
              <option key={autocar.id} value={autocar.id}>
                {autocar.inmatriculare} - {autocar.ruta}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="danger" type="submit" className="w-100 py-2 fs-5">
          Șterge autocar
        </Button>
      </Form>
    </Container>
  );
}