// src/App.js
import React, { useEffect, useRef } from "react";
import "./index.css";     // html/body { overflow:hidden } lives here
import Spline from "@splinetool/react-spline";

// how fast the cube spins per pixel scrolled
const SCROLL_FACTOR = 0.002;
// how fast the cube moves left/right per pixel scrolled
const MOVE_FACTOR   = 0.005;

const SECTION_COLORS = ["#FFC0CB", "#ADD8E6", "#90EE90", "#FFE4B5"];

export default function App() {
  const containerRef = useRef(null);
  const cubeRef      = useRef(null);

  // grab the cube when Spline loads
  function onLoad(app) {
    cubeRef.current = app.findObjectByName("Cube");
  }

  // as you scroll, rotate AND translate the cube
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!cubeRef.current) return;
      const scrollY = container.scrollTop;

      // rotation around Y
      cubeRef.current.rotation.y = scrollY * SCROLL_FACTOR;

      // left/right movement along X
      cubeRef.current.position.x = scrollY * MOVE_FACTOR;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* fixed, transparent canvas overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 1,
          background: "transparent",
        }}
      >
        <Spline
          scene="https://prod.spline.design/0Jz3JsDcm2xfVcQ4/scene.splinecode"
          onLoad={onLoad}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* single scroll container */}
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          margin: 0,
        }}
      >
        {SECTION_COLORS.map((bg, idx) => (
          <div
            key={idx}
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
            Section {idx + 1}
          </div>
        ))}
      </div>
    </>
  );
}
