import { useRef } from "react";
import profile from "../data/profile";
import { HiPhone, HiMail, HiLocationMarker, HiArrowUp } from "react-icons/hi";
import { SiWechat, SiQq } from "react-icons/si";
import BorderGlow from "./BorderGlow";
import Ferrofluid from "./Ferrofluid";
import { useSectionReveal } from "../lib/animations";

export default function Contact() {
  const scope = useRef(null);
  useSectionReveal(scope);

  const contactItems = [
    {
      icon: HiPhone,
      label: "电话",
      value: profile.contact.phone,
      href: `tel:${profile.contact.phone}`,
    },
    {
      icon: HiMail,
      label: "邮箱",
      value: profile.contact.email,
      href: `mailto:${profile.contact.email}`,
    },
    {
      icon: SiWechat,
      label: "微信",
      value: profile.contact.wechat,
      href: null,
    },
    {
      icon: SiQq,
      label: "QQ",
      value: profile.contact.qq,
      href: null,
    },
  ];

  return (
    <section
      ref={scope}
      id="contact"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Ferrofluid magnetic fluid background */}
      <Ferrofluid
        colors={["#6366f1", "#818cf8", "#a5b4fc"]}
        speed={0.3}
        scale={2.2}
        turbulence={0.8}
        fluidity={0.15}
        rimWidth={0.15}
        sharpness={3.5}
        shimmer={0.8}
        glow={1.5}
        flowDirection="down"
        opacity={0.3}
        mouseInteraction={true}
        mouseStrength={0.6}
        mouseRadius={0.25}
        mouseDampening={0.2}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-dark-950 via-transparent to-dark-950 pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04),transparent_70%)] pointer-events-none" />

      <div className="container-main relative z-10 py-24 md:py-32 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <p data-r-sub className="section-subtitle text-center">/ Contact</p>
            <h2 data-r-title className="section-title text-white mb-4">
              与我<span className="text-gradient"> 联系</span>
            </h2>
            <p data-r-desc className="text-white/30 text-lg max-w-xl mx-auto">
              期待与你的合作与交流，随时欢迎与我取得联系。
            </p>
          </div>

          {/* Contact Cards */}
          <div
            data-r-stagger
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
          >
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <div className="p-6 text-center flex-grow flex flex-col items-center justify-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center transition-all duration-500">
                    <Icon className="text-accent-400 text-lg" />
                  </div>
                  <p className="text-xs font-mono tracking-[0.15em] text-white/25 uppercase mb-2">
                    {item.label}
                  </p>
                  <p className="text-white/60 text-sm font-medium break-all">
                    {item.value}
                  </p>
                </div>
              );

              if (item.href) {
                return (
                  <a
                    key={i}
                    data-r-card
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex"
                  >
                    <BorderGlow glowIntensity={0.5}>{content}</BorderGlow>
                  </a>
                );
              }

              return (
                <div key={i} data-r-card className="flex">
                  <BorderGlow glowIntensity={0.5}>
                    {content}
                  </BorderGlow>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div data-r-card className="mt-24 pt-12 border-t border-white/[0.04]">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() =>
                  document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] hover:border-accent-500/20 transition-all duration-300 group"
              >
                <HiArrowUp className="text-white/30 group-hover:text-accent-400 transition-colors duration-300" />
              </button>
              <p className="text-white/15 text-xs font-mono mt-2">
                &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
              </p>
              <p className="text-white/08 text-xs font-mono">
                Built with React + Vite
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
