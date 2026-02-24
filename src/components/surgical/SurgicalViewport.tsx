import surgicalImage from "@/assets/surgical-viewport.jpg";

export function SurgicalViewport() {
  return (
    <div className="relative flex-1 rounded-xl overflow-hidden glow-border">
      <img
        src={surgicalImage}
        alt="Vista quirúrgica - Simulación de hígado"
        className="w-full h-full object-cover"
        draggable={false}
      />

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
    </div>
  );
}
