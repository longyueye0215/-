import { useRef } from "react";
import profile from "../data/profile";
import {
  HiPencilAlt, HiTranslate, HiShoppingBag,
  HiUserGroup, HiGlobe, HiLightningBolt,
} from "react-icons/hi";
import BorderGlow from "./BorderGlow";
import { useSectionReveal } from "../lib/animations";

const iconMap = {
  pen: HiPencilAlt,
  translate: HiTranslate,
  store: HiShoppingBag,
  leadership: HiUserGroup,
  social: HiGlobe,
  learn: HiLightningBolt,
};

export default function Strengths() {
  const scope = useRef(null);
  useSectionReveal(scope);

  return (
    <section ref={scope} id="strengths" className="relative section-padding">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent pointer-events-none" />

      <div className="container-main">
        <div className="mb-16">
          <p data-r-sub className="section-subtitle">/ Strengths</p>
          <h2 data-r-title className="section-title text-white">
            核心<span className="text-gradient"> 优势</span>
          </h2>
          <p data-r-desc className="text-white/30 text-lg mt-4 max-w-2xl">
            七种身份，六项核心能力，构筑独特的跨界竞争力。
          </p>
        </div>

        <div data-r-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.strengths.map((strength, i) => {
            const Icon = iconMap[strength.icon] || HiLightningBolt;
            return (
              <div key={i} data-r-card>
                <BorderGlow glowIntensity={0.6}>
                  <div className="p-8 h-full">
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-6 transition-all duration-500">
                      <Icon className="text-accent-400 text-xl" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 transition-colors duration-300">
                      {strength.title}
                    </h3>
                    <p className="text-white/35 text-sm leading-relaxed">{strength.desc}</p>
                    <div className="mt-6 w-0 h-px bg-accent-500/40 transition-all duration-500" />
                  </div>
                </BorderGlow>
              </div>
            );
          })}
        </div>

        {/* Tagline */}
        <div data-r-card className="mt-20 text-center">
          <BorderGlow glowIntensity={0.4} className="inline-block">
            <div className="px-8 py-5">
              <p className="text-lg md:text-xl text-white/50 font-light italic">
                &ldquo;{profile.tagline}&rdquo;
              </p>
            </div>
          </BorderGlow>
        </div>
      </div>
    </section>
  );
}
