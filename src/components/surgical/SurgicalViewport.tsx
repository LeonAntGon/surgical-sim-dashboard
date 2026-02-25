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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOrgan = organ || "liver";

  // Reset view when reset button is pressed
  useEffect(() => {
    setZoom([50]);
    setPan({ x: 0, y: 0 });
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
        setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [activeViewTool]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (activeViewTool === "zoom") {
        e.preventDefault();
        setZoom(([z]) => [Math.max(0, Math.min(100, z - e.deltaY * 0.1))]);
      }
    },
    [activeViewTool]
  );

  const cursor =
    activeViewTool === "move"
      ? isDragging.current ? "grabbing" : "grab"
      : activeViewTool === "zoom"
        ? "zoom-in"
        : "default";

  return (
    <div
      ref={containerRef}
      className="relative flex-1 rounded-xl overflow-hidden glow-border bg-background"
      style={{ cursor }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      <div
        className="w-full h-full transition-transform duration-100"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
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
      <div className="absolute bottom-3 right-3 glass-panel rounded-lg px-3 py-2 flex items-center gap-2 w-48">
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
        <span className="text-mono text-[10px] text-primary w-8 text-right">{zoom[0]}%</span>
      </div>
    </div>
  );
}
