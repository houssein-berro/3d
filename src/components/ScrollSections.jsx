// src/components/ScrollSections.jsx
import React from "react";

export default function ScrollSections({ containerRef, sections }) {
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y proximity",
      }}
    >
      {sections.map((bg, i) => (
        <div
          key={i}
          style={{
            height: "100vh",
            background: bg,
            scrollSnapAlign: "start",
          }}
        />
      ))}
    </div>
  );
}
