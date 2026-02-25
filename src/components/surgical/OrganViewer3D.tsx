import { Suspense, useRef, useState as useReactState, Component, ReactNode } from "react";
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

function OrganModel({ organ, zoom }: { organ: string; zoom: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const path = modelPaths[organ] || modelPaths.liver;
  const { scene } = useGLTF(path);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Rotación continua
      groupRef.current.rotation.y += delta * 0.15;

      // MEJORA: Zoom fluido modificando la escala en lugar del FOV de la cámara.
      // Mapeamos el valor de zoom (0-100) a un multiplicador de escala (ej. 0.5x a 2.5x).
      const targetScale = 0.5 + (zoom / 100) * 2;
      
      // Usamos lerp para que la transición del zoom sea suave ("mantequilla")
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <Center>
      {/* Añadimos una escala inicial un poco más pequeña por si el .glb original es gigante */}
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
}

export function OrganViewer3D({ organ, zoom }: OrganViewer3DProps) {
  const [webgl] = useReactState(() => supportsWebGL());

  if (!webgl) {
    return <FallbackImage organ={organ} zoom={zoom} />;
  }

  return (
    <WebGLErrorBoundary fallback={<FallbackImage organ={organ} zoom={zoom} />}>
      <Canvas
        // MEJORA: Alejamos la cámara (Z=6 en lugar de Z=3) y fijamos el FOV a 45.
        // Esto evita que el modelo te explote en la cara al cargar.
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} />
        <pointLight position={[0, 2, 0]} intensity={0.5} color="hsl(174, 60%, 60%)" />

        <Suspense fallback={<LoadingFallback />}>
          {/* Pasamos el zoom directamente al modelo */}
          <OrganModel organ={organ} zoom={zoom} />
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