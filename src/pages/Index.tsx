import { InstrumentToolbar } from "@/components/surgical/InstrumentToolbar";
import { TopToolbar } from "@/components/surgical/TopToolbar";
import { NavigationPanel } from "@/components/surgical/NavigationPanel";
import { BodyRegionNav } from "@/components/surgical/BodyRegionNav";
import { VitalStats } from "@/components/surgical/VitalStats";
import { SurgicalViewport } from "@/components/surgical/SurgicalViewport";

const Index = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background p-2 gap-2">
      {/* Top toolbar */}
      <TopToolbar />

      {/* Main area */}
      <div className="flex flex-1 gap-2 min-h-0">
        {/* Left: instruments */}
        <InstrumentToolbar />

        {/* Center: viewport */}
        <div className="flex flex-col flex-1 gap-2 min-h-0">
          <SurgicalViewport />
          {/* Bottom: body region nav */}
          <BodyRegionNav />
        </div>

        {/* Right panels */}
        <div className="flex flex-col gap-2">
          <NavigationPanel />
          <VitalStats />
        </div>
      </div>
    </div>
  );
};

export default Index;
