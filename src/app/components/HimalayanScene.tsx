import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Mountain({ position, scale }: { position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(1, 2, 8);
    const vertices = geo.attributes.position.array;

    // Add random variation to create jagged peaks
    for (let i = 0; i < vertices.length; i += 3) {
      if (vertices[i + 1] > 0) {
        vertices[i] += (Math.random() - 0.5) * 0.3;
        vertices[i + 2] += (Math.random() - 0.5) * 0.3;
      }
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#e8f4f8"
        roughness={0.8}
        metalness={0.2}
        emissive="#4a90a4"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

function RiverParticles({ curve, color }: { curve: THREE.CatmullRomCurve3; color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random();
      const point = curve.getPoint(t);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      speeds[i] = 0.001 + Math.random() * 0.003;
    }

    return { positions, speeds };
  }, [curve]);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const progress = (positions[idx] + positions[idx + 2]) / 20;
        const t = (progress + particles.speeds[i] * 100) % 1;
        const point = curve.getPoint(t);

        positions[idx] = point.x;
        positions[idx + 1] = point.y;
        positions[idx + 2] = point.z;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function SnowParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= 0.02;
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 30;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Define river paths
  const gangaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8, 3, -5),
      new THREE.Vector3(-6, 2.5, -3),
      new THREE.Vector3(-4, 2, -1),
      new THREE.Vector3(-2, 1.5, 1),
      new THREE.Vector3(0, 1, 3),
      new THREE.Vector3(2, 0.5, 5),
    ]);
  }, []);

  const yamunaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(8, 3, -5),
      new THREE.Vector3(6, 2.5, -3),
      new THREE.Vector3(4, 2, -1),
      new THREE.Vector3(2, 1.5, 1),
      new THREE.Vector3(0, 1, 3),
    ]);
  }, []);

  useFrame(() => {
    if (cameraRef.current) {
      // Camera movement based on scroll
      cameraRef.current.position.x = Math.sin(scrollProgress * Math.PI * 2) * 15;
      cameraRef.current.position.y = 8 + scrollProgress * 5;
      cameraRef.current.position.z = 12 - scrollProgress * 8;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 8, 12]} fov={60} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow color="#ffd89b" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#4fc3f7" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Mountains */}
      <Mountain position={[-8, 0, -5]} scale={3} />
      <Mountain position={[-5, 0, -7]} scale={2.5} />
      <Mountain position={[8, 0, -5]} scale={3.2} />
      <Mountain position={[5, 0, -8]} scale={2.8} />
      <Mountain position={[0, 0, -10]} scale={4} />
      <Mountain position={[-3, 0, -4]} scale={2} />
      <Mountain position={[3, 0, -6]} scale={2.3} />

      {/* River particles */}
      <RiverParticles curve={gangaCurve} color="#4fc3f7" />
      <RiverParticles curve={yamunaCurve} color="#29b6f6" />

      {/* Snow */}
      <SnowParticles />

      {/* Ground fog */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a2e" roughness={1} />
      </mesh>

      <fog attach="fog" args={['#0f0f1e', 5, 50]} />
    </>
  );
}

export default function HimalayanScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
