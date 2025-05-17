// client/src/pages/HomeUser.js

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Loader from "./Loader";
import CursaHarta from "../components/MockupCursa";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { get } from "../api/api";

export default function HomeUser() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [curse, setCurse] = useState([]);
  const [rezervari, setRezervari] = useState([]);
  const [curseViitoare, setCurseViitoare] = useState([]);
  const [curseTrecute, setCurseTrecute] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.rol !== "user") {
      navigate("/login");
    } else {
      setUsername(user.username);

      get(`/api/users/${user.username}`)
        .then((data) => {
          if (data?.id) {
            setUserId(data.id);

            get(`/api/rezervarile-mele?iduser=${data.id}`)
              .then((rez) => {
                if (Array.isArray(rez)) {
                  setRezervari(rez);
                  separaRezervariDupaData(rez);
                } else {
                  setRezervari([]);
                }
              })
              .catch((err) => console.error("Eroare rezervări:", err));
          }
        })
        .catch((err) => console.error("Eroare utilizator:", err));
    }

    get("/api/autocare-cu-ora")
      .then((data) => setCurse(data))
      .catch((err) => console.error("Eroare curse:", err));

    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const separaRezervariDupaData = (lista) => {
    const azi = new Date();
    azi.setHours(0, 0, 0, 0);

    const viitoare = [];
    const trecute = [];

    lista.forEach((rez) => {
      const dataRez = new Date(rez.data_rezervare);
      dataRez.setHours(0, 0, 0, 0);

      if (dataRez >= azi) {
        viitoare.push(rez);
      } else {
        trecute.push(rez);
      }
    });

    setCurseViitoare(viitoare);
    setCurseTrecute(trecute);
  };

  const handleRedirect1 = () => (window.location.href = "/rezerva-cursa");
  const handleRedirect2 = () => (window.location.href = "/anuleaza-cursa");

  if (loading) return <Loader />;

  return (
    <Container fluid style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #007bff, #000)", padding: "2rem", color: "white" }}>
      <Row className="mb-4 justify-content-between align-items-start" style={{ paddingInline: "1rem" }}>
        <Col xs={12} className="text-center">
          <h1 style={{ fontSize: "3rem" }}>Home</h1>
        </Col>
        <Col xs={12} className="text-end mt-2" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          <a href="/user-profile" style={{ color: "white", textDecoration: "underline" }}>
            Logged in as: {username}
          </a>
        </Col>
      </Row>

      {/* Curse disponibile */}
      <Row className="mb-4 px-3">
        <Col>
          <Card className="bg-transparent shadow" style={{ color: "white" }}>
            <Card.Body>
              <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Curse disponibile</Card.Title>
              <Row className="fw-bold border-bottom pb-2">
                <Col>Număr înmatriculare</Col>
                <Col>Plecare</Col>
                <Col>Destinație</Col>
              </Row>
              {Array.isArray(curse) && curse.map((cursa, index) => (
                <Row key={index} className="pt-2">
                  <Col>{cursa.numar_inmatriculare}</Col>
                  <Col>{cursa.plecare_oras}</Col>
                  <Col>{cursa.destinatie_oras}</Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Curse viitoare */}
      <Row className="mb-4 px-3">
        <Col>
          <Card className="bg-transparent shadow" style={{ color: "white" }}>
            <Card.Body>
              <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Curse viitoare</Card.Title>
              {curseViitoare.length === 0 ? (
                <p className="mt-3">Nu ai curse viitoare.</p>
              ) : (
                <>
                  <Row className="fw-bold border-bottom pb-2">
                    <Col>Data</Col>
                    <Col>Ora</Col>
                    <Col>Locuri</Col>
                    <Col>Plecare</Col>
                    <Col>Destinație</Col>
                    <Col>Autocar</Col>
                  </Row>
                  {curseViitoare.map((rez, idx) => (
                    <Row key={idx} className="pt-2 align-items-center">
                      <Col>{new Date(rez.data_rezervare).toLocaleDateString()}</Col>
                      <Col>{rez.ora_rezervare}</Col>
                      <Col>{rez.numar_locuri}</Col>
                      <Col>{rez.plecare}</Col>
                      <Col>{rez.destinatie}</Col>
                      <Col>{rez.numar_inmatriculare}</Col>
                    </Row>
                  ))}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Curse trecute */}
      <Row className="mb-4 px-3">
        <Col>
          <Card className="bg-transparent shadow" style={{ color: "white" }}>
            <Card.Body>
              <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Curse trecute</Card.Title>
              {curseTrecute.length === 0 ? (
                <p className="mt-3">Nu ai curse trecute.</p>
              ) : (
                <>
                  <Row className="fw-bold border-bottom pb-2">
                    <Col>Data</Col>
                    <Col>Ora</Col>
                    <Col>Locuri</Col>
                    <Col>Plecare</Col>
                    <Col>Destinație</Col>
                    <Col>Autocar</Col>
                  </Row>
                  {curseTrecute.map((rez, idx) => (
                    <Row key={idx} className="pt-2 align-items-center">
                      <Col>{new Date(rez.data_rezervare).toLocaleDateString()}</Col>
                      <Col>{rez.ora_rezervare}</Col>
                      <Col>{rez.numar_locuri}</Col>
                      <Col>{rez.plecare}</Col>
                      <Col>{rez.destinatie}</Col>
                      <Col>{rez.numar_inmatriculare}</Col>
                    </Row>
                  ))}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Butoane rezervare/anulare */}
      <Row className="mb-4 px-3">
        <Col xs={12} md={6} className="mb-3">
          <Button variant="success" className="w-100 py-3 fs-5" onClick={handleRedirect1}>
            Rezervă cursă
          </Button>
        </Col>
        <Col xs={12} md={6}>
          <Button variant="danger" className="w-100 py-3 fs-5" onClick={handleRedirect2}>
            Anulează cursă
          </Button>
        </Col>
      </Row>

      {/* Hartă curselor */}
      <Row className="mb-2 px-3">
        <Col>
          <h4 style={{ fontWeight: "bold" }}>Vizualizează harta curselor viitoare</h4>
        </Col>
      </Row>
      <Row className="mb-4 px-3">
        <Col>
          <div className="border rounded overflow-hidden shadow" style={{ height: "500px" }}>
            <CursaHarta />
          </div>
        </Col>
      </Row>

      {/* Contact */}
      <Row className="text-center pt-4" style={{ fontSize: "1.1rem" }}>
        <Col>Contact: contact@curseauto.ro | Telefon: 0723 456 789</Col>
      </Row>
    </Container>
  );
}