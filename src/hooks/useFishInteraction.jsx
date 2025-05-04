// src/hooks/useFishInteraction.js
import { useEffect } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

const MAX_EYE_TURN = 1;

export default function useFishInteraction({
  viewportSize,
  containerRef,
  fishGroupRef,
  facePivotRef,
  cameraRef,
}) {
  const { width, height } = viewportSize;

  // 1) Eyes follow cursor
  useEffect(() => {
    function handleMouseMove(e) {
      const xNorm = (e.clientX - width / 2) / (width / 2);
      const yNorm = -(e.clientY - height / 2) / (height / 2);
      const piv = facePivotRef.current;
      if (!piv) return;
      gsap.to(piv.rotation, {
        x: -yNorm * MAX_EYE_TURN,
        y: xNorm  * MAX_EYE_TURN,
        duration: 0.1,
        ease: "power2.out",
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [width, height, facePivotRef]);

  // 2) Log when pointer is over the fish
  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();
    const container = containerRef.current;

    function handlePointerMove(e) {
      if (!container || !cameraRef.current || !fishGroupRef.current) return;

      // normalize pointer relative to the scroll container
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, cameraRef.current);
      const hits = raycaster.intersectObject(fishGroupRef.current, true);
      if (hits.length > 0) {
        console.log("🐟 Pointer is over the fish! Hit mesh:", hits[0].object.name);
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [cameraRef, fishGroupRef, containerRef]);
}
