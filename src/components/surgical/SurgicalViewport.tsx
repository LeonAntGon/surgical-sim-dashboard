import { useState } from "react";
import { useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";
import { OrganViewer3D } from "./OrganViewer3D";

export function SurgicalViewport() {
  const { organ } = useParams<{ organ: string }>();
  const [zoom, setZoom] = useState([50]);

  const currentOrgan = organ || "liver";

  return (
    <div className="relative flex-1 rounded-xl overflow-hidden glow-border bg-background">
      <OrganViewer3D organ={currentOrgan} zoom={zoom[0]} />

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
