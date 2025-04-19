// src/App.js
import React, { useEffect, useRef } from "react";
import "./index.css";      // html/body { overflow: hidden } lives here
import Spline from "@splinetool/react-spline";


const MAX_SHIFT     = 200;
// Full rotation per section (2π = 360°)
const MAX_ROTATION  = Math.PI * 2;

const SECTION_COLORS = ["#FFC0CB", "#ADD8E6", "#90EE90", "#FFE4B5"];

export default function App() {
  const containerRef = useRef(null);
  const cubeRef      = useRef(null);

  // 1) Grab the cube once Spline loads
  function onLoad(app) {
    cubeRef.current = app.findObjectByName("Cube");
  }

  // 2) Track scroll and update cube position & rotation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      if (!cubeRef.current) return;

      const y   = container.scrollTop;
      const H   = window.innerHeight;
      const idx = Math.floor(y / H);           // which section we're in
      const t   = (y % H) / H;                 // progress [0..1) within that section

      // Determine start/end X for this segment:
      let startX, endX;
      if (idx === 0) {
        // Section 1→2: 0 → -MAX_SHIFT
        startX = 0;
        endX   = -MAX_SHIFT;
      } else if (idx % 2 === 1) {
        // odd idx (2→3, 4→5, …): -MAX_SHIFT → +MAX_SHIFT
        startX = -MAX_SHIFT;
        endX   = +MAX_SHIFT;
      } else {
        // even idx ≥2 (3→4, 5→6, …): +MAX_SHIFT → -MAX_SHIFT
        startX = +MAX_SHIFT;
        endX   = -MAX_SHIFT;
      }

      cubeRef.current.position.x = startX + (endX - startX) * t;
      const totalSections = y / H;
      cubeRef.current.rotation.y = totalSections * MAX_ROTATION;
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed, transparent canvas overlay */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100vh",
          pointerEvents: "none",
          background: "transparent",
          zIndex: 1,
        }}
      >
        <Spline
          scene="https://prod.spline.design/0Jz3JsDcm2xfVcQ4/scene.splinecode"
          onLoad={onLoad}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Scroll container with snap‐sections */}
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "auto",
          scrollSnapType: "y proximity",
          margin: 0,
        }}
      >
        {SECTION_COLORS.map((bg, i) => (
          <div
            key={i}
            className="section"
            style={{
              height: "100vh",
              background: bg,
              scrollSnapAlign: "start",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "#333",
            }}
          >
            Section {i + 1}
          </div>
        ))}
      </div>
    </>
  );
}
