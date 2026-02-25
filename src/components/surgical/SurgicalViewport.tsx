import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
// Agregamos los iconos de Chevron para los botones de dirección
import { ZoomIn, ZoomOut, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { OrganViewer3D } from "./OrganViewer3D";
import { useSimulation } from "@/contexts/SimulationContext";

export function SurgicalViewport() {
  const { organ } = useParams<{ organ: string }>();
  const { activeViewTool, viewResetCounter } = useSimulation();
  const [zoom, setZoom] = useState([50]);
  
  const pan = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentOrgan = organ || "liver";

  const updateTransform = () => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${pan.current.x}px, ${pan.current.y}px)`;
    }
  };

  // NUEVO: Función para mover la vista usando los botones
  const movePan = useCallback((dx: number, dy: number) => {
    pan.current = { x: pan.current.x + dx, y: pan.current.y + dy };
    updateTransform();
  }, []);

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
        updateTransform(); 
      }
    },
    [activeViewTool]
  );

  const handlePointerEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

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

      {/* NUEVO: Controles Direccionales (D-Pad) */}
      <div className="absolute bottom-3 left-3 glass-panel rounded-lg p-1.5 flex flex-col items-center gap-1 z-10">
        <button
          onClick={() => movePan(0, -50)}
          className="p-1 sm:p-1.5 hover:bg-primary/20 rounded-md transition-colors active:scale-95"
          title="Mover arriba"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => movePan(-50, 0)}
            className="p-1 sm:p-1.5 hover:bg-primary/20 rounded-md transition-colors active:scale-95"
            title="Mover izquierda"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>
          <button
            onClick={() => movePan(0, 50)}
            className="p-1 sm:p-1.5 hover:bg-primary/20 rounded-md transition-colors active:scale-95"
            title="Mover abajo"
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>
          <button
            onClick={() => movePan(50, 0)}
            className="p-1 sm:p-1.5 hover:bg-primary/20 rounded-md transition-colors active:scale-95"
            title="Mover derecha"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Zoom control overlay (Ahora es responsive: w-32 en móvil, w-48 en escritorio) */}
      <div className="absolute bottom-3 right-3 glass-panel rounded-lg px-2 sm:px-3 py-2 flex items-center gap-2 w-32 sm:w-48 z-10">
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
        <span className="text-mono text-[10px] text-primary w-8 text-right hidden sm:inline-block">
          {Math.round(zoom[0])}%
        </span>
      </div>
    </div>
  );
}