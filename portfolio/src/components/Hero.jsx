import { useRef } from "react";
import { HiArrowDown, HiMail } from "react-icons/hi";
import Prism from "./Prism";
import profile from "../data/profile";
import { useHeroTimeline } from "../lib/animations";

export default function Hero() {
  const titles = profile.title.split(" / ");
  const scope = useRef(null);
  useHeroTimeline(scope);

  return (
    <section
      ref={scope}
      id="hero"
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Prism WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Prism
          animationType="rotate"
          timeScale={0.3}
          height={3.5}
          baseWidth={5.5}
          scale={3.2}
          hueShift={0}
          colorFrequency={0.8}
          noise={0.3}
          glow={0.8}
          bloom={1.2}
          suspendWhenOffscreen={true}
        />
      </div>

      {/* Darkening overlays for text readability */}
      <div data-hero-overlay className="absolute inset-0 z-1 bg-gradient-to-b from-dark-950/30 via-dark-950/20 to-dark-950/70" />
      <div data-hero-overlay className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,10,12,0.75)_70%)]" />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 z-1 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-main text-center">
        {/* Subtitle line */}
        <div data-hero-badge className="mb-6">
          <span className="inline-block px-4 py-1.5 text-xs font-mono tracking-[0.3em] text-accent-300 border border-accent-500/20 rounded-full bg-accent-500/5">
            PERSONAL PORTFOLIO
          </span>
        </div>

        {/* Main Title */}
        <h1
          data-hero-title
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-4"
        >
          {profile.name}
        </h1>

        <p
          data-hero-nameen
          className="text-lg md:text-2xl text-white/50 font-light tracking-wide mb-2"
        >
          {profile.nameEn}
        </p>

        {/* Title tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-12">
          {titles.map((t, i) => (
            <span
              key={i}
              data-hero-tag
              className="px-4 py-1.5 text-sm text-white/40 font-mono border border-white/[0.08] rounded-lg bg-white/[0.02]"
            >
              {t.trim()}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          data-hero-cta
          className="flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group px-8 py-3.5 text-sm font-medium text-white bg-accent-500 hover:bg-accent-400 rounded-xl transition-all duration-300 shadow-xl shadow-accent-500/25 hover:shadow-accent-500/40 flex items-center gap-2"
          >
            <HiMail className="text-lg" />
            查看作品
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 text-sm font-medium text-white/60 hover:text-white border border-white/[0.12] hover:border-white/[0.25] rounded-xl transition-all duration-300"
          >
            联系方式
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          data-hero-scroll
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <HiArrowDown className="text-white/20 text-2xl animate-bounce" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-dark-950 to-transparent pointer-events-none" />
    </section>
  );
}
