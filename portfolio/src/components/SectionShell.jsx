import { useEffect, useState } from "react";
import About from "./About";
import Experience from "./Experience";
import Projects from "./Projects";
import Strengths from "./Strengths";
import Contact from "./Contact";
import OrbField from "./OrbField";
import SectionBackdrop from "./SectionBackdrop";
import { views } from "../data/views";
import "./Landing.css";

const SECTIONS = {
  about: About,
  experience: Experience,
  projects: Projects,
  strengths: Strengths,
  contact: Contact,
};

export default function SectionShell({ view, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const Section = SECTIONS[view] ?? About;
  const meta = views.find((v) => v.id === view);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const pick = (id) => {
    setMenuOpen(false);
    onNavigate?.(id);
  };

  return (
    <div className="relative bg-dark-950 min-h-screen">
      <SectionBackdrop />

      {/* 左上角：同款小球 = 分区切换器 */}
      <button
        type="button"
        aria-label="切换分区"
        onClick={() => setMenuOpen((v) => !v)}
        className="fixed top-6 left-6 z-[60] flex flex-col items-center gap-1.5 group"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <span
          className="corner-orb"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "block",
            background:
              "radial-gradient(circle at 35% 30%, #ffffff 0%, #7fd0ff 55%, rgba(8,16,32,0.95) 100%)",
            boxShadow: "0 0 20px rgba(127,208,255,0.75), inset 0 0 10px rgba(255,255,255,0.6)",
          }}
        />
        <span className="text-[9px] tracking-[0.3em] text-white/40 group-hover:text-white/75 transition-colors">
          分区
        </span>
      </button>

      <div className="fixed top-6 right-6 z-[60] text-[10px] font-mono tracking-[0.3em] text-white/25">
        {meta?.label} · {meta?.sub}
      </div>

      {/* 分区选择浮层（复用 OrbField） */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          style={{ background: "rgba(2,5,12,0.74)", backdropFilter: "blur(6px)" }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="relative"
            style={{ width: 660, height: 430 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute"
              style={{
                left: "50%",
                top: "86%",
                width: 130,
                height: 130,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #ffffff 0%, rgba(140,200,255,0.65) 55%, rgba(8,16,32,0.92) 100%)",
                boxShadow: "0 0 52px rgba(140,200,255,0.6)",
              }}
            />
            <OrbField open origin={{ x: 50, y: 86 }} radius={190} onSelect={pick} />
            <button
              type="button"
              onClick={() => pick("landing")}
              className="absolute left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] text-white/50 hover:text-white/90 transition-colors"
              style={{ bottom: 12, background: "transparent", border: "none", cursor: "pointer" }}
            >
              返回开屏
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10">
        <Section />
      </main>
    </div>
  );
}
