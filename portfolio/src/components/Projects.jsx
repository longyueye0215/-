import { useRef } from "react";
import profile from "../data/profile";
import { HiArrowRight } from "react-icons/hi";
import BorderGlow from "./BorderGlow";
import { useSectionReveal, useImageReveal } from "../lib/animations";

// 排列顺序：凤雏、闲鱼、甘园房、空耳
const order = [0, 3, 1, 2];

export default function Projects() {
  const projects = profile.projects;
  const scope = useRef(null);
  useSectionReveal(scope);
  useImageReveal(scope);

  return (
    <section ref={scope} id="projects" className="relative section-padding">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.04),transparent_50%)] pointer-events-none" />

      <div className="container-main">
        <div className="mb-16">
          <p data-r-sub className="section-subtitle">/ Projects</p>
          <h2 data-r-title className="section-title text-white">
            精选<span className="text-gradient"> 项目</span>
          </h2>
          <p data-r-desc className="text-white/30 text-lg mt-4 max-w-2xl">
            每一个项目都是一次跨界探索，从国家级课题到个人翻译实战。
          </p>
        </div>

        <div data-r-stagger className="grid md:grid-cols-2 gap-6">
          {order.map((idx, i) => {
            const project = projects[idx];
            return (
              <div key={idx} data-r-card>
                <BorderGlow borderRadius={16} glowIntensity={0.7}>
                  <div className="group overflow-hidden rounded-2xl cursor-pointer">
                    {/* Image — reveal + parallax, centered for 闲鱼 */}
                    <div className={`overflow-hidden border-b border-white/[0.06] ${idx === 3 ? "w-full flex justify-center" : "w-fit"}`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        data-img-reveal
                        data-img-parallax
                        className="h-[340px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02] will-change-transform"
                        loading="lazy"
                      />
                    </div>

                    {/* Text content */}
                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-accent-300 transition-colors duration-300">
                            {project.title}
                          </h3>
                          <p className="text-accent-400/80 text-sm font-mono mt-1">
                            {project.subtitle}
                          </p>
                        </div>
                        <HiArrowRight className="text-white/40 text-xl shrink-0 mt-2 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-500" />
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-2xl whitespace-pre-line">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-[11px] font-mono text-white/50 bg-white/[0.06] border border-white/[0.08] rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </BorderGlow>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
