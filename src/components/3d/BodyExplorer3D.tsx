import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface JointHotspot {
  key: string;
  name: string;
  position: [number, number, number];
}

interface BodyExplorer3DProps {
  selectedPart: string;
  onSelectPart: (part: string) => void;
  mode: 'xray' | 'nervous' | 'muscle' | 'joints';
}

const hotspots: JointHotspot[] = [
  { key: 'brain', name: 'Brain & Cranial', position: [0, 1.6, 0] },
  { key: 'neck', name: 'Neck / Cervical', position: [0, 1.25, 0] },
  { key: 'shoulder', name: 'Shoulder Joint', position: [-0.35, 1.05, 0] },
  { key: 'elbow', name: 'Elbow Joint', position: [-0.44, 0.65, 0] },
  { key: 'wrist', name: 'Wrist Joint', position: [-0.5, 0.25, 0] },
  { key: 'back', name: 'Lumbar Spine', position: [0, 0.45, -0.05] },
  { key: 'hip', name: 'Hip & Pelvis', position: [-0.18, 0.05, 0] },
  { key: 'knee', name: 'Knee Joint', position: [-0.2, -0.55, 0] },
  { key: 'ankle', name: 'Ankle & Foot', position: [-0.22, -1.15, 0] }
];

// Procedural Bone Mesh with flared anatomical ends
const Bone: React.FC<{
  length: number;
  width: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  opacity?: number;
}> = ({ length, width, position, rotation = [0, 0, 0], color = '#f8fafc', opacity = 0.85 }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Shaft */}
      <mesh>
        <cylinderGeometry args={[width, width, length, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Flared Epiphysis Ends */}
      <mesh position={[0, length / 2, 0]}>
        <sphereGeometry args={[width * 1.6, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0, -length / 2, 0]}>
        <sphereGeometry args={[width * 1.6, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
};

// Muscle Spindle Mesh (Spindle-shaped red fibers)
const MuscleSpindle: React.FC<{
  length: number;
  width: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
}> = ({ length, width, position, rotation = [0, 0, 0], opacity = 0.65 }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <sphereGeometry args={[width, 16, 16]} />
      <meshStandardMaterial
        color="#ef4444"
        roughness={0.8}
        metalness={0.0}
        emissive="#7f1d1d"
        emissiveIntensity={0.2}
        transparent
        opacity={opacity}
        wireframe
      />
    </mesh>
  );
};

// Detailed Procedural Ribcage
const Ribcage: React.FC<{ opacity: number }> = ({ opacity }) => {
  const ribs = Array.from({ length: 9 });
  return (
    <group position={[0, 0.95, 0]}>
      {/* Sternum (Chest Bone) */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.04, 0.5, 0.02]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>
      {/* Rib Arcs */}
      {ribs.map((_, idx) => {
        const yOffset = 0.2 - idx * 0.055;
        const radius = 0.16 + idx * 0.008;
        return (
          <group key={idx} position={[0, yOffset, 0]}>
            {/* Left Rib */}
            <mesh rotation={[Math.PI / 2, 0, 0.2]} position={[-0.08, 0, 0.05]}>
              <torusGeometry args={[radius, 0.008, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
            </mesh>
            {/* Right Rib */}
            <mesh rotation={[Math.PI / 2, 0, -Math.PI - 0.2]} position={[0.08, 0, 0.05]}>
              <torusGeometry args={[radius, 0.008, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Spine Vertebrae Column
const SpineColumn: React.FC<{ opacity: number }> = ({ opacity }) => {
  const discs = Array.from({ length: 24 });
  return (
    <group>
      {discs.map((_, idx) => {
        const yPos = 1.35 - idx * 0.048;
        return (
          <mesh key={idx} position={[0, yPos, -0.05]}>
            <boxGeometry args={[0.06, 0.028, 0.048]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.7} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
};

// Detailed Procedural Pelvis Girdle
const Pelvis: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <group position={[0, 0.08, 0]}>
      {/* Sacrum spine base */}
      <mesh position={[0, 0.05, -0.06]}>
        <boxGeometry args={[0.08, 0.1, 0.04]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>
      {/* Left Hip bone wing */}
      <mesh position={[-0.11, 0, 0]} rotation={[0, -0.3, 0.4]}>
        <boxGeometry args={[0.12, 0.16, 0.015]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>
      {/* Right Hip bone wing */}
      <mesh position={[0.11, 0, 0]} rotation={[0, 0.3, -0.4]}>
        <boxGeometry args={[0.12, 0.16, 0.015]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

// Floating Hotspot Node with Pulsing scanning HUD rings
const HotspotNode: React.FC<{
  hotspot: JointHotspot;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ hotspot, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      const pulse = 1 + Math.sin(elapsed * 7) * 0.1;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringRef.current) {
      const ringScale = 1.0 + (elapsed % 1.2) * 1.5;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - (elapsed % 1.2) / 1.2) * 0.45;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = elapsed * 1.5;
    }
  });

  return (
    <group position={hotspot.position}>
      {/* Pulsing expand ripple ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* Rotating medical tracking dash HUD */}
      <mesh ref={innerRingRef}>
        <ringGeometry args={[0.045, 0.055, 6, 1]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Core interactive pointer */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'crosshair';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.032, 32, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#00e5ff' : hovered ? '#22d3ee' : '#0891b2'}
          transparent
          opacity={isSelected ? 0.95 : 0.75}
        />
      </mesh>
    </group>
  );
};

// Molecular scanning particles background
const StarBackground: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#00e5ff"
        size={0.024}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

// Full Human Anatomy Layers
const ProceduralAnatomyModel: React.FC<{
  mode: 'xray' | 'nervous' | 'muscle' | 'joints';
  selectedPart: string;
}> = ({ mode, selectedPart }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
      groupRef.current.position.y = Math.sin(time * 1.2) * 0.015; // Soft breathing cycle
    }
  });

  // Material Opacities based on active diagnostic toggles
  const isJoints = mode === 'joints';
  const showSkeleton = mode === 'xray' || mode === 'muscle' || mode === 'joints';
  const showMuscles = mode === 'muscle';
  const showNerves = mode === 'nervous';

  const skeletonOpacity = isJoints ? 0.08 : mode === 'muscle' ? 0.25 : 0.85;

  return (
    <group ref={groupRef}>
      {/* 1. SKELETON LAYER */}
      {showSkeleton && (
        <group>
          {/* Cranium / Skull */}
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.7}
              transparent
              opacity={skeletonOpacity}
              wireframe={mode === 'joints'}
            />
          </mesh>
          <mesh position={[0, 1.48, 0.08]}>
            <boxGeometry args={[0.1, 0.08, 0.08]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={skeletonOpacity} />
          </mesh>

          {/* Spine Column */}
          <SpineColumn opacity={skeletonOpacity} />

          {/* Ribcage */}
          <Ribcage opacity={skeletonOpacity} />

          {/* Pelvis Girdle */}
          <Pelvis opacity={skeletonOpacity} />

          {/* Clavicles (Collar bones) */}
          <Bone length={0.24} width={0.012} position={[-0.14, 1.15, 0.05]} rotation={[0, 0, Math.PI / 2.2]} opacity={skeletonOpacity} />
          <Bone length={0.24} width={0.012} position={[0.14, 1.15, 0.05]} rotation={[0, 0, -Math.PI / 2.2]} opacity={skeletonOpacity} />

          {/* Arm Bones (Left) */}
          <Bone length={0.34} width={0.018} position={[-0.4, 0.85, 0]} rotation={[0, 0, 0.1]} opacity={skeletonOpacity} />
          <Bone length={0.32} width={0.014} position={[-0.48, 0.45, 0]} rotation={[0, 0, 0.05]} opacity={skeletonOpacity} />

          {/* Arm Bones (Right) */}
          <Bone length={0.34} width={0.018} position={[0.4, 0.85, 0]} rotation={[0, 0, -0.1]} opacity={skeletonOpacity} />
          <Bone length={0.32} width={0.014} position={[0.48, 0.45, 0]} rotation={[0, 0, -0.05]} opacity={skeletonOpacity} />

          {/* Leg Bones (Left) */}
          <Bone length={0.52} width={0.03} position={[-0.18, -0.22, 0]} rotation={[0, 0, 0.05]} opacity={skeletonOpacity} />
          <Bone length={0.5} width={0.024} position={[-0.2, -0.85, 0]} rotation={[0, 0, 0.02]} opacity={skeletonOpacity} />

          {/* Leg Bones (Right) */}
          <Bone length={0.52} width={0.03} position={[0.18, -0.22, 0]} rotation={[0, 0, -0.05]} opacity={skeletonOpacity} />
          <Bone length={0.5} width={0.024} position={[0.2, -0.85, 0]} rotation={[0, 0, -0.02]} opacity={skeletonOpacity} />
        </group>
      )}

      {/* 2. MUSCLE LAYER */}
      {showMuscles && (
        <group>
          {/* Pecs (Chest muscles) */}
          <MuscleSpindle length={0.25} width={0.12} position={[-0.16, 1.05, 0.09]} rotation={[0.2, 0, -0.2]} />
          <MuscleSpindle length={0.25} width={0.12} position={[0.16, 1.05, 0.09]} rotation={[0.2, 0, 0.2]} />
          {/* Abs */}
          <MuscleSpindle length={0.3} width={0.15} position={[0, 0.65, 0.08]} />
          
          {/* Deltoids (Shoulders) */}
          <MuscleSpindle length={0.16} width={0.08} position={[-0.38, 1.05, 0]} />
          <MuscleSpindle length={0.16} width={0.08} position={[0.38, 1.05, 0]} />

          {/* Biceps (Arms) */}
          <MuscleSpindle length={0.24} width={0.065} position={[-0.4, 0.85, 0.02]} />
          <MuscleSpindle length={0.24} width={0.065} position={[0.4, 0.85, 0.02]} />

          {/* Quads (Thighs) */}
          <MuscleSpindle length={0.4} width={0.11} position={[-0.18, -0.22, 0.08]} />
          <MuscleSpindle length={0.4} width={0.11} position={[0.18, -0.22, 0.08]} />
        </group>
      )}

      {/* 3. NERVOUS SYSTEM LAYER */}
      {showNerves && (
        <group>
          {/* Yellow Brain core */}
          <mesh position={[0, 1.55, 0.02]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.8} />
          </mesh>

          {/* Main Spinal Cord */}
          <mesh position={[0, 0.75, -0.045]}>
            <cylinderGeometry args={[0.015, 0.01, 1.25, 8]} />
            <meshBasicMaterial color="#facc15" transparent opacity={0.9} />
          </mesh>

          {/* Branching Neural Networks (Nerve threads) */}
          <mesh position={[-0.22, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.003, 0.001, 0.4, 8]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.22, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.003, 0.001, 0.4, 8]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.8} />
          </mesh>

          <mesh position={[-0.15, -0.4, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.004, 0.001, 0.9, 8]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.15, -0.4, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.004, 0.001, 0.9, 8]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Smooth targeted Camera tracker
const CameraTracker: React.FC<{ selectedPart: string }> = ({ selectedPart }) => {
  const { camera } = useThree();

  useFrame(() => {
    const activeHotspot = hotspots.find((h) => h.key === selectedPart);
    
    // Default coordinates vs targeted coordinates
    const targetX = activeHotspot ? activeHotspot.position[0] * 1.6 : 0;
    const targetY = activeHotspot ? activeHotspot.position[1] : 0.2;
    const targetZ = activeHotspot ? 1.5 : 2.8;

    // Smooth lerps
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
  });

  return null;
};

export const BodyExplorer3D: React.FC<BodyExplorer3DProps> = ({
  selectedPart,
  onSelectPart,
  mode
}) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950/20">
      <Canvas
        camera={{ position: [0, 0.2, 2.8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.8} color="#00e5ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#0891b2" />

        <StarBackground />
        
        {/* Procedural Anatomy Model Layering */}
        <ProceduralAnatomyModel mode={mode} selectedPart={selectedPart} />

        {/* Hotspots always visible to allow navigation */}
        {hotspots.map((h) => (
          <HotspotNode
            key={h.key}
            hotspot={h}
            isSelected={selectedPart === h.key}
            onSelect={() => onSelectPart(h.key)}
          />
        ))}

        <CameraTracker selectedPart={selectedPart} />
      </Canvas>
    </div>
  );
};
