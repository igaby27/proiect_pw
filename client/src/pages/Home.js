import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import MapView from '../components/MapView';

export default function Home() {
  const [curse, setCurse] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/clienti')
      .then((res) => res.json())
      .then((data) => setCurse(data))
      .catch((err) => console.error('Eroare la fetch:', err));
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Home</h1>
      <Row>
        {/* Lista de curse */}
        <Col md={6}>
          <h4>Curse auto - listă</h4>
          <ListGroup className="mt-3">
            {curse.map((cursa) => (
              <ListGroup.Item key={cursa.id} className="d-flex justify-content-between">
                <span>{cursa.tip}</span>
                <span>{cursa.nr}</span>
                <span>{cursa.ruta}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Secțiune admin */}
        <Col md={6}>
          <h4 className="text-center">User Admin</h4>
          <Card className="mt-3">
            <Card.Body>
              {/* Cursă */}
              <div className="mb-4 d-grid gap-2">
                <Button variant="primary">Adaugă o nouă cursă</Button>
                <Button variant="outline-secondary">Editează o cursă existentă</Button>
              </div>

              <hr />

              {/* Autoturism */}
              <div className="mb-4 d-grid gap-2">
                <Button variant="success">Adaugă un nou autoturism</Button>
                <Button variant="outline-secondary">Editează un autoturism</Button>
              </div>

              {/* Hartă păstrată */}
              <div className="mt-4">
                <MapView />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
