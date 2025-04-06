import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const mockCurse = [
  { id: 1, tip: 'Autocar', nr: 'B70CAR', ruta: 'București - Ploiești' },
  { id: 2, tip: 'Microbuz', nr: 'CJ99XYZ', ruta: 'Cluj - Oradea' },
];

export default function Home() {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Home</h1>
      <Row>
        {/* Lista de curse */}
        <Col md={6}>
          <h4>Curse auto - listă</h4>
          <ListGroup className="mt-3">
            {mockCurse.map((cursa) => (
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
              <div className="mb-4">
                <Card.Title>Adaugă o nouă cursă</Card.Title>
                <Card.Text className="text-center text-muted">SAU</Card.Text>
                <Card.Text>Editează o cursă existentă</Card.Text>
              </div>

              <hr />

              <div className="mb-4">
                <Card.Title>Adaugă un nou autoturism</Card.Title>
                <Card.Text className="text-center text-muted">SAU</Card.Text>
                <Card.Text>Editează un autoturism</Card.Text>
              </div>

              <div className="border p-3 text-center mt-4 bg-light">
                Hartă cu cursele auto
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
