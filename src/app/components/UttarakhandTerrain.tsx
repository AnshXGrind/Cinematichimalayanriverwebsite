import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import EnhancedControls from './EnhancedControls';

export interface CameraPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
  icon: string;
}

interface RiverPathData {
  name: string;
  color: string;
  points: [number, number, number][];
  width: number;
}

interface SacredSiteData {
  name: string;
  position: [number, number, number];
  type: 'source' | 'temple' | 'confluence' | 'village';
  color: string;
}

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const segments = 120;
    const size = 50;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);

    const vertices = geo.attributes.position.array;

    // Create Himalayan-style terrain with multiple peaks and valleys
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];

      // Multiple mountain peaks
      let height = 0;

      // Main Himalayan ridge (north)
      height += Math.exp(-((y - 15) ** 2) / 40) * 8;

      // Secondary peaks
      height += Math.exp(-((x - 10) ** 2 + (y - 12) ** 2) / 30) * 6;
      height += Math.exp(-((x + 8) ** 2 + (y - 14) ** 2) / 25) * 7;
      height += Math.exp(-((x + 15) ** 2 + (y - 10) ** 2) / 35) * 5;

      // Valley regions (where rivers flow)
      height -= Math.exp(-((x - 5) ** 2 + (y - 5) ** 2) / 20) * 2;
      height -= Math.exp(-((x + 5) ** 2 + (y + 2) ** 2) / 25) * 1.5;

      // River valleys - carve paths
      const riverValley1 = Math.exp(-((x - 2) ** 2) / 2) * 0.8;
      const riverValley2 = Math.exp(-((x + 6) ** 2) / 2) * 0.7;
      height -= riverValley1 + riverValley2;

      // Add noise for natural texture
      const noise = (Math.sin(x * 0.5) * Math.cos(y * 0.5) +
                     Math.sin(x * 1.2) * Math.cos(y * 0.8)) * 0.3;
      height += noise;

      // Lower elevation in the south (plains)
      height -= Math.exp((y + 15) / 10) * 2;

      vertices[i + 2] = Math.max(height, 0);
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();

    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <meshStandardMaterial
        color="#e8f4f8"
        roughness={0.85}
        metalness={0.1}
        emissive="#2a5a6a"
        emissiveIntensity={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function RiverPath({ pathData }: { pathData: RiverPathData }) {
  const lineRef = useRef<THREE.Line>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 300;

  const curve = useMemo(() => {
    const points = pathData.points.map(p => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(points);
  }, [pathData.points]);

  const lineGeometry = useMemo(() => {
    const points = curve.getPoints(100);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [curve]);

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random();
      const point = curve.getPoint(t);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      speeds[i] = 0.0005 + Math.random() * 0.002;
      sizes[i] = 0.05 + Math.random() * 0.1;
    }

    return { positions, speeds, sizes };
  }, [curve, particleCount]);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;

        // Calculate progress along curve
        let t = ((Date.now() * particles.speeds[i]) % 10000) / 10000;
        t = (t + i / particleCount) % 1;

        const point = curve.getPoint(t);
        positions[idx] = point.x;
        positions[idx + 1] = point.y;
        positions[idx + 2] = point.z;

        // Pulsing size
        sizes[i] = particles.sizes[i] * (1 + Math.sin(Date.now() * 0.003 + i) * 0.3);
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* River path line with glow */}
      <line ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={pathData.color}
          linewidth={pathData.width}
          transparent
          opacity={0.6}
        />
      </line>

      {/* Glow effect */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={pathData.color}
          linewidth={pathData.width * 3}
          transparent
          opacity={0.2}
        />
      </line>

      {/* Animated particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={pathData.color}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function SnowParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 3000;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      speeds[i] = 0.01 + Math.random() * 0.03;
    }

    return { positions, speeds };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx + 1] -= particles.speeds[i];

        // Slight horizontal drift
        positions[idx] += Math.sin(Date.now() * 0.0001 + i) * 0.002;
        positions[idx + 2] += Math.cos(Date.now() * 0.0001 + i) * 0.002;

        // Reset particle if it goes below ground
        if (positions[idx + 1] < 0) {
          positions[idx + 1] = 40;
          positions[idx] = (Math.random() - 0.5) * 100;
          positions[idx + 2] = (Math.random() - 0.5) * 100;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AmbientParticles({ position, color }: { position: [number, number, number]; color: string }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position[0] + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = position[1] + Math.random() * 3;
      positions[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 2;
      speeds[i] = 0.01 + Math.random() * 0.02;
    }

    return { positions, speeds };
  }, [position]);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx + 1] += particles.speeds[i];

        // Reset particle if it goes too high
        if (positions[idx + 1] > position[1] + 3) {
          positions[idx + 1] = position[1];
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SacredSiteMarker({ site }: { site: SacredSiteData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = site.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.3;
    }
  });

  const icon = site.type === 'source' ? '⛰️' :
               site.type === 'temple' ? '🛕' :
               site.type === 'confluence' ? '🌊' : '🏘️';

  return (
    <group position={site.position}>
      {/* Ambient particles */}
      <AmbientParticles position={[0, 0, 0]} color={site.color} />

      {/* Glowing base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 0.05, 32]} />
        <meshBasicMaterial
          color={site.color}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Pulsing glow ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial
          color={site.color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main marker */}
      <mesh
        ref={meshRef}
        position={[0, 0.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={site.color}
          emissive={site.color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Light beam */}
      <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.1, 4, 8, 1, true]} />
        <meshBasicMaterial
          color={site.color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Html position={[0, 1.2, 0]} center>
        <div className={`transition-all duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
          <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 whitespace-nowrap">
            <div className="text-white text-sm font-light tracking-wider flex items-center gap-2">
              <span>{icon}</span>
              <span>{site.name}</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ cameraPreset }: { cameraPreset: CameraPreset | null }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Animate camera to preset position
  useFrame(() => {
    if (cameraPreset && cameraRef.current && controlsRef.current) {
      // Smoothly interpolate camera position
      camera.position.lerp(
        new THREE.Vector3(...cameraPreset.position),
        0.05
      );

      // Smoothly interpolate target
      const currentTarget = controlsRef.current.target;
      currentTarget.lerp(
        new THREE.Vector3(...cameraPreset.target),
        0.05
      );

      controlsRef.current.update();
    }
  });

  // Define river paths based on Uttarakhand geography
  const riverPaths: RiverPathData[] = useMemo(() => [
    {
      name: 'Bhagirathi',
      color: '#4fc3f7',
      width: 2,
      points: [
        [-8, 7, 15],    // Gangotri (source)
        [-7, 6.5, 12],
        [-6, 5.8, 9],
        [-5, 5, 6],
        [-4, 4.2, 3],
        [-3, 3.5, 0],
        [-2, 2.8, -3],
        [-1, 2, -6],    // Approaching Devprayag
        [0, 1.5, -9],   // Devprayag
      ],
    },
    {
      name: 'Alaknanda',
      color: '#29b6f6',
      width: 2,
      points: [
        [10, 7.5, 18],  // Satopanth (source)
        [9, 7, 15],     // Near Badrinath
        [8, 6.5, 12],
        [7, 6, 9],
        [6, 5.5, 6],
        [5, 5, 3],
        [4, 4.5, 0],
        [2, 3.5, -3],
        [1, 2.5, -6],
        [0, 1.5, -9],   // Devprayag (meets Bhagirathi)
      ],
    },
    {
      name: 'Yamuna',
      color: '#81d4fa',
      width: 1.5,
      points: [
        [-15, 7, 12],   // Yamunotri (source)
        [-14, 6.5, 10],
        [-13, 6, 8],
        [-12, 5.5, 6],
        [-11, 5, 4],
        [-10, 4.5, 2],
        [-9, 4, 0],
        [-8, 3.5, -2],  // Flows separately east
      ],
    },
    {
      name: 'Mandakini',
      color: '#4dd0e1',
      width: 1.5,
      points: [
        [5, 6.5, 10],   // Near Kedarnath
        [4.5, 6, 8],
        [4, 5.5, 6],
        [3.5, 5, 4],
        [3, 4.5, 2],
        [2, 4, 0],      // Rudraprayag
      ],
    },
    {
      name: 'Ganga (after Devprayag)',
      color: '#ffd89b',
      width: 3,
      points: [
        [0, 1.5, -9],   // Devprayag
        [0, 1.2, -12],
        [0, 0.8, -15],
        [0, 0.5, -18],
        [0, 0.2, -21],  // Flowing to plains
      ],
    },
  ], []);

  // Define sacred sites
  const sacredSites: SacredSiteData[] = useMemo(() => [
    { name: 'Gangotri', position: [-8, 7.2, 15], type: 'source', color: '#4fc3f7' },
    { name: 'Yamunotri', position: [-15, 7.2, 12], type: 'source', color: '#81d4fa' },
    { name: 'Kedarnath', position: [5, 6.8, 10], type: 'temple', color: '#4dd0e1' },
    { name: 'Badrinath', position: [9, 7.3, 15], type: 'temple', color: '#29b6f6' },
    { name: 'Devprayag', position: [0, 1.8, -9], type: 'confluence', color: '#ffd89b' },
    { name: 'Rudraprayag', position: [2, 4.3, 0], type: 'confluence', color: '#4fc3f7' },
    { name: 'Mana Village', position: [10, 7.5, 18], type: 'village', color: '#ff9a9e' },
  ], []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[25, 15, 25]} fov={50} />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 3, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[20, 20, 10]}
        intensity={1.2}
        castShadow
        color="#fff5e6"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#4fc3f7" />
      <pointLight position={[-10, 8, 10]} intensity={0.4} color="#ffd89b" />

      {/* Stars */}
      {Array.from({ length: 1000 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 200,
            Math.random() * 100 + 20,
            (Math.random() - 0.5) * 200,
          ]}
        >
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={Math.random() * 0.8 + 0.2} />
        </mesh>
      ))}

      {/* Terrain */}
      <Terrain />

      {/* River Paths */}
      {riverPaths.map((path) => (
        <RiverPath key={path.name} pathData={path} />
      ))}

      {/* Sacred Sites */}
      {sacredSites.map((site) => (
        <SacredSiteMarker key={site.name} site={site} />
      ))}

      {/* Snow particles */}
      <SnowParticles />

      {/* Ground plane for reference */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a0a0f" roughness={1} />
      </mesh>

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#0f1419', 20, 80]} />
    </>
  );
}

interface UttarakhandTerrainProps {
  className?: string;
}

export default function UttarakhandTerrain({ className }: UttarakhandTerrainProps) {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>(null);

  const handlePresetClick = (preset: CameraPreset) => {
    setCameraPreset(preset);
    // Reset after animation completes
    setTimeout(() => setCameraPreset(null), 3000);
  };

  return (
    <div className={className || "w-full h-screen"}>
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <Scene cameraPreset={cameraPreset} />
      </Canvas>

      {/* UI Overlay */}
      <motion.div
        className="absolute top-8 left-8 z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
          <h3 className="text-2xl font-light text-white mb-2 tracking-wide">
            Uttarakhand Himalayas
          </h3>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            Sacred rivers flowing from the glaciers to the plains
          </p>
          <div className="mt-4 space-y-2 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4fc3f7]" />
              <span>Bhagirathi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#29b6f6]" />
              <span>Alaknanda</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#81d4fa]" />
              <span>Yamuna</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffd89b]" />
              <span>Ganga (post-confluence)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Camera Preset Controls */}
      <EnhancedControls onPresetClick={handlePresetClick} />

      {/* Controls hint */}
      <motion.div
        className="absolute bottom-8 right-8 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
          <div className="text-sm text-white/60 space-y-1">
            <div>🖱️ Drag to rotate</div>
            <div>🔍 Scroll to zoom</div>
            <div>✋ Right-click to pan</div>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="absolute top-8 right-8 z-10"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
          <h4 className="text-lg font-light text-white mb-3 tracking-wide">Legend</h4>
          <div className="space-y-2 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span>⛰️</span>
              <span>Sacred Source</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛕</span>
              <span>Temple</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌊</span>
              <span>Confluence</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏘️</span>
              <span>Village</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
