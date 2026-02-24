import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Eye, EyeOff, Layers } from "lucide-react";

const layers = [
  { id: "skin", label: "Piel", visible: false },
  { id: "muscle", label: "Músculo", visible: false },
  { id: "liver", label: "Hígado", visible: true },
  { id: "vessels", label: "Vasos", visible: true },
  { id: "gallbladder", label: "Vesícula", visible: true },
];

export function NavigationPanel() {
  const [zoom, setZoom] = useState([20]);
  const [layerState, setLayerState] = useState(layers);

  const toggleLayer = (id: string) => {
    setLayerState((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  return (
    <div className="glass-panel rounded-xl p-4 w-56 flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider">Navegación</span>
      </div>

      {/* Zoom */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-muted-foreground">Zoom</span>
          <span className="text-mono text-xs text-primary">{zoom[0]}%</span>
        </div>
        <Slider
          value={zoom}
          onValueChange={setZoom}
          max={100}
          min={5}
          step={1}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
        />
      </div>

      <div className="h-px bg-border" />

      {/* Layers */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Capas</span>
        {layerState.map((layer) => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className="flex items-center justify-between px-2 py-1.5 rounded-md transition-colors hover:bg-secondary text-xs"
          >
            <span className={layer.visible ? "text-foreground" : "text-muted-foreground"}>
              {layer.label}
            </span>
            {layer.visible ? (
              <Eye className="w-3.5 h-3.5 text-primary" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
