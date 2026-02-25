import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";
import { OrganViewer3D } from "./OrganViewer3D";
import { useSimulation } from "@/contexts/SimulationContext";

export function SurgicalViewport() {
  const { organ } = useParams<{ organ: string }>();
  const { activeViewTool, viewResetCounter } = useSimulation();
  const [zoom, setZoom] = useState([50]);
  
  // MEJORA: Usamos Refs para el paneo. Al no usar useState, evitamos re-renders 
  // masivos del modelo 3D al arrastrar, vital para el rendimiento en celulares.
  const pan = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentOrgan = organ || "liver";

  // Función para actualizar el DOM directamente sin re-renderizar React
  const updateTransform = () => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${pan.current.x}px, ${pan.current.y}px)`;
    }
  };

  // Reset view when reset button is pressed
  useEffect(() => {
    setZoom([50]);
    pan.current = { x: 0, y: 0 };
    updateTransform();
  }, [viewResetCounter]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (activeViewTool === "move") {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }
    },
    [activeViewTool]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging.current && activeViewTool === "move") {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        pan.current = { x: pan.current.x + dx, y: pan.current.y + dy };
        lastPos.current = { x: e.clientX, y: e.clientY };
        updateTransform(); // Actualizamos visualmente
      }
    },
    [activeViewTool]
  );

  // MEJORA: Función unificada para soltar, cancelar o salir del área
  const handlePointerEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // MEJORA: Manejo nativo del wheel para poder usar preventDefault sin warnings
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (activeViewTool === "zoom") {
        e.preventDefault();
        setZoom((prevZoom) => [
          Math.max(0, Math.min(100, prevZoom[0] - e.deltaY * 0.05))
        ]);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [activeViewTool]);

  const cursor =
    activeViewTool === "move"
      ? isDragging.current ? "grabbing" : "grab"
      : activeViewTool === "zoom"
        ? "zoom-in"
        : "default";

  return (
    <div
      ref={containerRef}
      // MEJORA: touch-none evita que el celular intente scrollear la web al arrastrar
      className="relative flex-1 rounded-xl overflow-hidden glow-border bg-background touch-none"
      style={{ cursor }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
    >
      <div
        ref={contentRef}
        // MEJORA: Reduje la duración de la transición para que el drag se sienta inmediato
        className="w-full h-full transition-transform duration-75"
        style={{
          transform: `translate(${pan.current.x}px, ${pan.current.y}px)`,
        }}
      >
        <OrganViewer3D organ={currentOrgan} zoom={zoom[0]} />
      </div>

      {/* Crosshair overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-6 h-px bg-primary/40" />
        <div className="h-6 w-px bg-primary/40 absolute" />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, hsl(var(--background) / 0.6) 100%)",
        }}
      />

      {/* Zoom control overlay */}
      <div className="absolute bottom-3 right-3 glass-panel rounded-lg px-3 py-2 flex items-center gap-2 w-48 z-10">
        <ZoomOut className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <Slider
          value={zoom}
          onValueChange={setZoom}
          max={100}
          min={0}
          step={1}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
        />
        <ZoomIn className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-mono text-[10px] text-primary w-8 text-right">
          {Math.round(zoom[0])}%
        </span>
      </div>
    </div>
  );
}