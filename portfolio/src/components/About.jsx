import { useRef } from "react";
import profile from "../data/profile";
import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi";
import { SiWechat, SiQq } from "react-icons/si";
import BorderGlow from "./BorderGlow";
import { useSectionReveal } from "../lib/animations";

export default function About() {
  const scope = useRef(null);
  useSectionReveal(scope);

  return (
    <section ref={scope} id="about" className="relative section-padding">
      <div className="container-main">
        <div className="mb-16">
          <p data-r-sub className="section-subtitle">/ About</p>
          <h2 data-r-title className="section-title text-white">
            关于<span className="text-gradient"> 我</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Profile + Education + Certificates */}
          <div data-r-stagger className="lg:col-span-4">
            {/* Avatar */}
            <div data-r-card className="mb-6">
              <BorderGlow borderRadius={20} glowIntensity={0.6}>
                <div className="relative rounded-[20px] bg-gradient-to-br from-accent-500/10 to-accent-900/10 p-5 flex items-center gap-5">
                  <img
                    src="/avatar.jpg"
                    alt="赵鹏"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover ring-1 ring-white/[0.08]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">
                      {profile.name}
                    </h3>
                    <p className="text-xs font-mono text-accent-400/70 mt-1 tracking-wider">
                      {profile.title}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {profile.roles.map((role, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] text-white/40 bg-white/[0.03] border border-white/[0.06] rounded-md"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>

            {/* Contact Info */}
            <div data-r-card className="mb-6 space-y-2">
              {[
                { icon: HiPhone, text: profile.contact.phone },
                { icon: HiMail, text: profile.contact.email },
                { icon: SiWechat, text: profile.contact.wechat },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/50 border border-white/[0.08] rounded-lg bg-white/[0.04] hover:bg-white/[0.07] hover:text-white/70 transition-all duration-300"
                >
                  <item.icon className="text-accent-400/70 text-xs shrink-0" />
                  <span className="font-mono text-xs">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Education */}
            <div data-r-card className="mb-6">
              <BorderGlow>
                <div className="p-5">
                  <h3 className="text-xs font-mono tracking-[0.2em] text-accent-400 uppercase mb-4">
                    教育背景
                  </h3>
                  <p className="text-white/80 font-medium text-sm">{profile.education.school}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {profile.education.college} · {profile.education.major}
                  </p>
                  <p className="text-white/25 text-xs">{profile.education.degree} · {profile.education.year}</p>
                </div>
              </BorderGlow>
            </div>

            {/* Certificates */}
            <div data-r-card>
              <BorderGlow>
                <div className="p-5">
                  <h3 className="text-xs font-mono tracking-[0.2em] text-accent-400 uppercase mb-4">
                    资质证书
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.certificates.map((cert, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[10px] text-white/45 bg-white/[0.03] border border-white/[0.06] rounded-md"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>

          {/* Right: Bio + Skills + Stats */}
          <div data-r-stagger className="lg:col-span-8">
            {/* Bio — 分段 */}
            <div data-r-card className="mb-10">
              <h3 className="text-xs font-mono tracking-[0.2em] text-accent-400 uppercase mb-4">
                个人介绍
              </h3>
              <p className="text-white/60 text-base leading-relaxed text-balance">
                一个行动力极强、善于组织协调团队工作、自学能力强、有很强上进心的人。
              </p>
              <p className="text-white/60 text-base leading-relaxed text-balance mt-3">
                从写作到翻译，从电商到内容运营，每一次跨界都不只是尝试，而是全力以赴。
              </p>
            </div>

            {/* Skills */}
            <div data-r-card className="mb-10">
              <h3 className="text-xs font-mono tracking-[0.2em] text-accent-400 uppercase mb-4">
                掌握技能
              </h3>
              <BorderGlow borderRadius={16} glowIntensity={0.5}>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <p className="text-sm text-white/70 leading-relaxed">
                        <span className="text-accent-400 font-medium">办公软件</span>
                      </p>
                      <p className="text-sm text-white/40 leading-relaxed">
                        能够熟练使用 Word、PPT、Excel、PS、PR 等办公软件，具备图文排版、数据分析、视频剪辑与视觉设计能力。
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-white/70 leading-relaxed">
                        <span className="text-accent-400 font-medium">AI 工具</span>
                      </p>
                      <p className="text-sm text-white/40 leading-relaxed">
                        能够熟练使用各种主流 AI 软件，如 WorkBuddy、CodeBuddy、Codex、元宝、Gork、ChatGPT 等，善于利用 AI 辅助创作、编程与效率提升。
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-white/70 leading-relaxed">
                        <span className="text-accent-400 font-medium">打字速度</span>
                      </p>
                      <p className="text-sm text-white/40 leading-relaxed">
                        打字速度最高能做到 80 字/分，具备高效的信息录入与文档处理能力。
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-white/70 leading-relaxed">
                        <span className="text-accent-400 font-medium">语言能力</span>
                      </p>
                      <p className="text-sm text-white/40 leading-relaxed">
                        中日双语工作水准，具备日语 N1 同等能力（备考 CATTI 三级笔译），可进行中日翻译与跨文化交流。
                      </p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>

            {/* Stats */}
            <div data-r-card>
              <h3 className="text-xs font-mono tracking-[0.2em] text-accent-400 uppercase mb-6">
                关键数据
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.stats.map((stat, i) => (
                  <BorderGlow key={i} borderRadius={12} glowIntensity={0.5}>
                    <div className="p-5 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl md:text-4xl font-black text-white transition-colors duration-500">
                          {stat.value}
                        </span>
                        {stat.suffix && (
                          <span className="text-sm text-white/30">{stat.suffix}</span>
                        )}
                      </div>
                      <p className="text-xs text-white/30 mt-2 font-mono tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
