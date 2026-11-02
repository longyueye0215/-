import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroBg from "../assets/hero-miku.webp";
import StarfieldParticles from "./StarfieldParticles";
import OrbGlow from "./OrbGlow";
import LottieLayer from "./LottieLayer";

gsap.registerPlugin(ScrollTrigger);

/**
 * 开屏视觉合成层（阶段 B）
 *
 * 图层顺序（自后向前）：
 *   ① 底图 hero-miku.png —— 鼠标/滚动视差（幅度最小）+ 滚动微推镜
 *   ② StarfieldParticles —— 银河星点 + 流星粒子（幅度更大，形成 2.5D 景深）
 *   ③ OrbGlow —— 发光球体呼吸辉光（跟随底图，始终对准球体）
 *   ④ LottieLayer —— 星点闪烁装饰（A4）
 *
 * 注意：抠出的前景层 hero-miku-fg.png 暂不叠加做差速视差，
 * 因为底图本身已含角色，叠加后位移会产生重影；该素材留作进阶（先抠掉底图角色再分层）。
 */
export default function HeroOpening({
  orb = { x: 48, y: 80, size: 520 },
  starDensity = 0.18,
  meteorSpeed = 0.15,
}) {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    const pt = particlesRef.current;
    if (!root || !bg || !pt) return;

    const bgX = gsap.quickTo(bg, "x", { duration: 0.9, ease: "power3.out" });
    const bgY = gsap.quickTo(bg, "y", { duration: 0.9, ease: "power3.out" });
    const ptX = gsap.quickTo(pt, "x", { duration: 0.9, ease: "power3.out" });
    const ptY = gsap.quickTo(pt, "y", { duration: 0.9, ease: "power3.out" });

    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      const nx = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      const ny = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
      bgX(nx * -24);
      bgY(ny * -16);
      ptX(nx * -54);
      ptY(ny * -34);
    };
    window.addEventListener("pointermove", onMove);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    tl.to(bg, { yPercent: 8, scale: 1.06, ease: "none" }, 0);
    tl.to(pt, { yPercent: 26, ease: "none" }, 0);

    return () => {
      window.removeEventListener("pointermove", onMove);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 z-0 overflow-hidden">
      {/* ① 底图 + 球体呼吸（同层，保证辉光始终对准球体） */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover scale-110"
          draggable="false"
        />
        <OrbGlow x={orb.x} y={orb.y} size={orb.size} />
      </div>

      {/* ② 银河星点 + 流星粒子 */}
      <div ref={particlesRef} className="absolute inset-0 will-change-transform">
        <StarfieldParticles
          className="absolute inset-0"
          dpr={1}
          starDensity={starDensity}
          meteorSpeed={meteorSpeed}
        />
      </div>

      {/* ④ Lottie 星点闪烁 */}
      <LottieLayer />
    </div>
  );
}
