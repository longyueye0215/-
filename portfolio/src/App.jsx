import { useRef, useState } from "react";
import Landing from "./components/Landing";
import SectionShell from "./components/SectionShell";
import WarpTransition from "./components/WarpTransition";
import HexLoader from "./components/HexLoader";

export default function App() {
  const [view, setView] = useState("landing");
  const [warpActive, setWarpActive] = useState(false);
  const [booting, setBooting] = useState(true);   // 首屏六边形加载页
  const targetRef = useRef(null);

  const navigate = (target) => {
    if (warpActive || !target || target === view) return;
    targetRef.current = target;
    setWarpActive(true);
  };

  const handleMid = () => {
    const t = targetRef.current;
    if (t) setView(t);
  };

  const handleDone = () => {
    setWarpActive(false);
    targetRef.current = null;
  };

  return (
    <>
      {booting && <HexLoader brand="LONGYUEYE—ARCHIVE" duration={1000} onDone={() => setBooting(false)} />}
      {view === "landing" ? (
        <Landing onSelect={navigate} />
      ) : (
        <SectionShell view={view} onNavigate={navigate} />
      )}
      <WarpTransition active={warpActive} onMid={handleMid} onDone={handleDone} />
    </>
  );
}
