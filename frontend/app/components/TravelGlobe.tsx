"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  const [dayMap, normalMap, specularMap] = useTexture([
    "/earth_day.jpg",
    "/earth_normal.jpg",
    "/earth_specular.jpg",
  ]);

  useFrame((_, delta) => {
    earthRef.current.rotation.y += delta * 0.08;
    cloudsRef.current.rotation.y += delta * 0.10;
    glowRef.current.rotation.y += delta * 0.08;
  });

  return (
    // Posisi globe di tengah layar, sedikit ke bawah
    <group position={[0, -0.2, 0]}>
      {/* Earth surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhongMaterial
          map={dayMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={15}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.83, 64, 64]} />
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.96, 64, 64]} />
        <meshPhongMaterial
          color="#38bdf8"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function TravelGlobe() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ height: "100dvh" }}>
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 50,
        }}
        dpr={[1, 1.5]}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Ambient light */}
        <ambientLight intensity={0.25} />

        {/* Main sunlight from top-right */}
        <directionalLight
          position={[6, 4, 4]}
          intensity={2.8}
          color="#fff5e0"
        />

        {/* Soft blue fill from left */}
        <pointLight
          position={[-5, -2, 2]}
          intensity={0.5}
          color="#6ee7f7"
        />

        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={2.5}
          saturation={0}
          fade
          speed={0.3}
        />

        <Earth />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
        />
      </Canvas>
    </div>
  );
}
