// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SplineBackground   from "./components/SplineBackground";
import ScrollSections     from "./components/ScrollSections";
import useFishInteraction from "./hooks/useFishInteraction";

const SECTION_COUNT = 4;

export default function App() {
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const containerRef = useRef(null);
  const fishGroupRef = useRef(null);
  const facePivotRef = useRef(null);
  const cameraRef    = useRef(null);

  // update viewport on resize
  useEffect(() => {
    function onResize() {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // on Spline load: capture camera + fish group + pivot + center geometry
  function handleSplineLoad(app) {
    cameraRef.current = app.camera;

    const grp = app.findObjectByName("Group");
    if (!grp) return;
    fishGroupRef.current = grp;

    const raw = app._scene.getObjectByName("Group");
    const pivotMesh = raw.children.find(ch => ch.isMesh && /eye|face/i.test(ch.name));
    facePivotRef.current = pivotMesh || grp;

    const box = new THREE.Box3().setFromObject(raw);
    const center = new THREE.Vector3();
    box.getCenter(center);
    grp.position.sub(center);
  }

  // attach interaction logic
  useFishInteraction({
    viewportSize,
    containerRef,
    fishGroupRef,
    facePivotRef,
    cameraRef,
  });

  return (
    <>
      <SplineBackground onLoad={handleSplineLoad} />
      <ScrollSections
        containerRef={containerRef}
        sections={Array.from({ length: SECTION_COUNT })}
      />
    </>
  );
}
