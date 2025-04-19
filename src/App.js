// src/App.js
import React, { useEffect, useRef, useState } from "react";
import "./index.css";      // html/body { overflow:hidden } here
import Spline from "@splinetool/react-spline";

// one full spin per section (360°)
const MAX_ROTATION   = Math.PI * 2;
// section background colors (add as many as you like)
const SECTION_COLORS = ["#FFC0CB", "#ADD8E6", "#90EE90", "#FFE4B5"];

export default function App() {
  // 1) track viewport size
  const [dims, setDims] = useState({
    width:  window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const onResize = () =>
      setDims({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 2) refs for scroll container & cube
  const containerRef = useRef(null);
  const cubeRef      = useRef(null);

  // 3) grab the cube when Spline loads
  function onLoad(app) {
    cubeRef.current = app.findObjectByName("Cube");
    // initial responsive scale
    const baseScale = Math.min(Math.max(dims.width / 1920, 0.5), 1.5);
    cubeRef.current.scale.set(baseScale, baseScale, baseScale);
  }

  // 4) update scale on resize
  useEffect(() => {
    if (cubeRef.current) {
      const baseScale = Math.min(Math.max(dims.width / 1920, 0.5), 1.5);
      cubeRef.current.scale.set(baseScale, baseScale, baseScale);
    }
  }, [dims]);

  // 5) scroll handler for rotation & horizontal zig‑zag
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    function onScroll() {
      if (!cubeRef.current) return;

      const y   = c.scrollTop;
      const H   = dims.height;
      const idx = Math.floor(y / H);
      const t   = (y % H) / H;    // progress [0..1) in current section

      // determine slide direction and endpoints
      let startX, endX;
      if (idx === 0) {
        startX = 0;        endX = -MAX_SHIFT;
      } else if (idx % 2 === 1) {
        startX = -MAX_SHIFT; endX = +MAX_SHIFT;
      } else {
        startX = +MAX_SHIFT; endX = -MAX_SHIFT;
      }
      const posX = startX + (endX - startX) * t;

      // apply horizontal & rotational transforms
      cubeRef.current.position.x   = posX;
      cubeRef.current.rotation.y   = (y / H) * MAX_ROTATION;
    }

    // compute MAX_SHIFT based on width (30% of viewport)
    const MAX_SHIFT = dims.width * 0.1;

    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, [dims]);

  return (
    <>
      {/* Fixed, transparent canvas overlay */}
      <div
        style={{
          position:     "fixed",
          top:          0,
          left:         0,
          width:       "100%",
          height:      "100vh",
          pointerEvents:"none",
          background:  "transparent",
          zIndex:       1,
        }}
      >
        <Spline
          scene="https://prod.spline.design/0Jz3JsDcm2xfVcQ4/scene.splinecode"
          onLoad={onLoad}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Scroll container with snap‑sections */}
      <div
        ref={containerRef}
        style={{
          height:         "100vh",
          overflowY:      "auto",
          scrollSnapType: "y proximity",
          margin:         0,
        }}
      >
        {SECTION_COLORS.map((bg, i) => (
          <div
            key={i}
            className="section"
            style={{
              height:            "100vh",
              background:        bg,
              scrollSnapAlign:   "start",
              display:           "flex",
              alignItems:        "center",
              justifyContent:    "center",
              fontSize:          "2rem",
              color:             "#333",
            }}
          >
            Section {i + 1}
          </div>
        ))}
      </div>
    </>
  );
}
