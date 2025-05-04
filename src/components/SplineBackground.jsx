// src/components/SplineBackground.jsx
import React from "react";
import Spline from "@splinetool/react-spline";

export default function SplineBackground({ onLoad }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Spline
        scene="https://prod.spline.design/56w6iwdlKlF8qqih/scene.splinecode"
        onLoad={onLoad}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
