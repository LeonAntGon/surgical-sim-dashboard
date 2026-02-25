import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

const modelPaths: Record<string, string> = {
  kidney: "/models/kidney.glb",
  liver: "/models/liver.glb",
};

function OrganModel({ organ }: { organ: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const path = modelPaths[organ] || modelPaths.liver;
  const { scene } = useGLTF(path);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="hsl(174, 60%, 40%)" wireframe />
    </mesh>
  );
}

interface OrganViewer3DProps {
  organ: string;
  zoom: number;
}

export function OrganViewer3D({ organ, zoom }: OrganViewer3DProps) {
  const fov = 50 - (zoom / 100) * 30; // zoom 0 → fov 50, zoom 100 → fov 20

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="hsl(174, 60%, 60%)" />

      <Suspense fallback={<LoadingFallback />}>
        <OrganModel organ={organ} />
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        dampingFactor={0.05}
        enableDamping
      />
    </Canvas>
  );
}

// Preload models
Object.values(modelPaths).forEach((path) => useGLTF.preload(path));
