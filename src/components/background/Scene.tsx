"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGameStore } from "@/store/game-store";

const MOOD_COLORS: Record<string, [string, string, string]> = {
  neutral: ["#2e1065", "#1e3a5f", "#431407"],
  truth: ["#4c1d95", "#312e81", "#1e1b4b"],
  dare: ["#7c2d12", "#9a3412", "#831843"],
  party: ["#5b21b6", "#c2410c", "#a16207"],
  chaos: ["#701a75", "#9f1239", "#b45309"],
};

function Blob({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.2 + Math.random() * 0.3, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.35;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.z = t * 0.15;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.22}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

function FloatingCard({
  position,
  rot,
  color,
}: {
  position: [number, number, number];
  rot: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + rot) * 0.25;
    ref.current.rotation.y = rot + t * 0.25;
    ref.current.rotation.z = Math.sin(t * 0.4 + rot) * 0.15;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={ref} position={position} rotation={[0.3, rot, 0.1]}>
        <mesh>
          <boxGeometry args={[0.7, 1, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.45, 0.45]} />
          <meshBasicMaterial color="#f8fafc" transparent opacity={0.85} />
        </mesh>
      </group>
    </Float>
  );
}

function Particles({ color }: { color: string }) {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function SceneContent() {
  const mood = useGameStore((s) => s.bgMood);
  const colors = MOOD_COLORS[mood] || MOOD_COLORS.neutral;
  const cardColors = ["#7C3AED", "#F97316", "#EAB308", "#F97066", "#1E3A5F"];

  return (
    <>
      <color attach="background" args={["#0b1020"]} />
      <fog attach="fog" args={["#0b1020", 8, 22]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fde68a" />
      <pointLight position={[-4, 2, 2]} intensity={0.6} color={colors[0]} />
      <pointLight position={[4, -1, 1]} intensity={0.5} color={colors[1]} />

      <Blob position={[-3.5, 0.5, -2]} color={colors[0]} scale={2.2} />
      <Blob position={[3.2, -0.8, -3]} color={colors[1]} scale={1.8} />
      <Blob position={[0.5, 2, -4]} color={colors[2]} scale={2.5} />
      <Blob position={[-1, -2, -2]} color={colors[0]} scale={1.4} />

      {cardColors.map((c, i) => (
        <FloatingCard
          key={i}
          position={[
            Math.sin(i * 1.2) * 4,
            Math.cos(i * 0.9) * 2,
            -1 - (i % 3),
          ]}
          rot={i * 0.8}
          color={c}
        />
      ))}

      <Particles color="#fbbf24" />
      <Sparkles count={40} scale={12} size={2} speed={0.3} color="#fde68a" opacity={0.4} />
    </>
  );
}

export function BackgroundScene() {
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);

  if (reduceMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-violet-950 via-slate-950 to-orange-950" />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <SceneContent />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/80" />
    </div>
  );
}
