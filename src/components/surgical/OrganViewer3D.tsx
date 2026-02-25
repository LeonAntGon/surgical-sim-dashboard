import { Suspense, useRef, useState as useReactState, Component, ReactNode, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import * as THREE from "three";
import surgicalKidney from "@/assets/surgical-kidney.jpg";
import surgicalLiver from "@/assets/surgical-liver.jpg";

const modelPaths: Record<string, string> = {
  kidney: "/models/kidney.glb",
  liver: "/models/liver.glb",
};

const fallbackImages: Record<string, string> = {
  kidney: surgicalKidney,
  liver: surgicalLiver,
};

// Recibimos panRef
interface OrganModelProps {
  organ: string;
  zoom: number;
  panRef: React.MutableRefObject<{ x: number; y: number }>;
}

function OrganModel({ organ, zoom, panRef }: OrganModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const path = modelPaths[organ] || modelPaths.liver;
  const { scene } = useGLTF(path);

  // Auto-escalado para centrar modelos grandes/pequeños
  useLayoutEffect(() => {
    if (scene) {
      scene.scale.set(1, 1, 1);
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      if (maxDim > 0) {
        const scale = 4 / maxDim;
        scene.scale.set(scale, scale, scale);
      }
    }
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      // 1. Zoom fluido
      const targetScale = 0.5 + (zoom / 100) * 2;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // 2. Paneo fluido en espacio 3D (SOLUCIÓN AL CORTE)
      // Multiplicamos por 0.015 para convertir la fuerza de los píxeles a distancia 3D.
      // Invertimos Y (-panRef) porque en HTML "abajo" es positivo, pero en 3D "abajo" es negativo.
      const targetX = panRef.current.x * 0.015;
      const targetY = -panRef.current.y * 0.015;

      groupRef.current.position.lerp(
        new THREE.Vector3(targetX, targetY, 0),
        0.15
      );
    }
  });

  return (
    <Center>
      <group ref={groupRef} scale={1}>
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

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function FallbackImage({ organ, zoom }: { organ: string; zoom: number }) {
  const src = fallbackImages[organ] || fallbackImages.liver;
  return (
    <img
      src={src}
      alt={`Vista quirúrgica - ${organ}`}
      className="w-full h-full object-cover transition-transform duration-200"
      style={{ transform: `scale(${1 + zoom / 100})` }}
      draggable={false}
    />
  );
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

interface OrganViewer3DProps {
  organ: string;
  zoom: number;
  panRef: React.MutableRefObject<{ x: number; y: number }>;
}

export function OrganViewer3D({ organ, zoom, panRef }: OrganViewer3DProps) {
  const [webgl] = useReactState(() => supportsWebGL());

  if (!webgl) {
    return <FallbackImage organ={organ} zoom={zoom} />;
  }

  return (
    <WebGLErrorBoundary fallback={<FallbackImage organ={organ} zoom={zoom} />}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} />
        <pointLight position={[0, 2, 0]} intensity={0.5} color="hsl(174, 60%, 60%)" />

        <Suspense fallback={<LoadingFallback />}>
          <OrganModel organ={organ} zoom={zoom} panRef={panRef} />
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
    </WebGLErrorBoundary>
  );
}

Object.values(modelPaths).forEach((path) => useGLTF.preload(path));