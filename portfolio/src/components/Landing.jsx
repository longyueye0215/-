import { useState } from "react";
import heroBg from "../assets/hero-miku.webp";
import StarCanvas from "./StarCanvas";
import OrbField from "./OrbField";
import "./Landing.css";

const ORB = { x: 48, y: 69 };

export default function Landing({ onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable="false"
      />

      <div className="absolute inset-0">
        <StarCanvas />
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          left: `${ORB.x}%`,
          top: `${ORB.y}%`,
          width: 340,
          height: 340,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="orb-breathe w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(225,245,255,0.9) 0%, rgba(150,205,255,0.38) 42%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <button
        type="button"
        aria-label="展开分区星球"
        onClick={() => setOpen((v) => !v)}
        className="orb-hotspot absolute rounded-full"
        style={{
          left: `${ORB.x}%`,
          top: `${ORB.y}%`,
          width: 280,
          height: 280,
          transform: "translate(-50%, -50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span className="orb-ring" />
      </button>

      <OrbField open={open} origin={ORB} onSelect={onSelect} />

      <div className="absolute left-0 right-0 top-[10%] text-center pointer-events-none px-6">
        <div className="text-[10px] md:text-xs tracking-[0.45em] text-white/45 mb-3">
          PERSONAL PORTFOLIO
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          赵鹏
        </h1>
        <div className="mt-4 text-xs md:text-sm text-white/55 tracking-widest">
          {open ? "选择一颗星球，进入对应分区" : "点击初音怀中的光球，展开分区星球"}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </section>
  );
}
