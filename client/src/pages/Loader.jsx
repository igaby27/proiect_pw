import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader() {
  return (
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
}