import { useRef } from "react";
import profile from "../data/profile";
import BorderGlow from "./BorderGlow";
import { useSectionReveal } from "../lib/animations";

export default function Experience() {
  const scope = useRef(null);
  useSectionReveal(scope);

  return (
    <section ref={scope} id="experience" className="relative section-padding">
      <div className="container-main">
        <div className="mb-16">
          <p data-r-sub className="section-subtitle">/ Experience</p>
          <h2 data-r-title className="section-title text-white">
            个人<span className="text-gradient"> 经历</span>
          </h2>
          <p data-r-desc className="text-white/30 text-lg mt-4 max-w-2xl">
            每一段经历都不是孤立存在，而是彼此交汇、相互塑造。
          </p>
        </div>

        <div data-r-stagger className="space-y-0">
          {profile.timeline.map((item, i) => (
            <div
              key={i}
              data-r-card
              className="relative pb-8"
            >
              {i < profile.timeline.length - 1 && (
                <div className="absolute left-[4.5rem] top-14 bottom-0 w-px bg-white/[0.06]" />
              )}
              <BorderGlow borderRadius={14} glowIntensity={0.4}>
                <div className="p-6 flex gap-6 items-start">
                  <div className="shrink-0 w-14 text-center pt-0.5">
                    <span className="text-xs font-mono text-accent-400/60 leading-tight block">
                      {item.year.split("–").map((part, idx) => (
                        <span key={idx}>
                          {idx > 0 && <br />}
                          {part}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white/80 font-medium text-sm">{item.title}</h4>
                    <p className="text-white/30 text-sm mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </BorderGlow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
