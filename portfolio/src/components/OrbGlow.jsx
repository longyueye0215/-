import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * 发光球体「呼吸」辉光
 * 以径向渐变叠加在球体位置，用 GSAP 做 scale/opacity 往复（呼吸感）
 * 位置与尺寸可通过 props 微调，便于验收时对准底图中的球体
 */
export default function OrbGlow({
  x = 50,
  y = 54,
  size = 460,
  color = "rgba(215,242,255,0.92)",
  midColor = "rgba(140,200,255,0.42)",
  duration = 3.2,
  maxScale = 1.20,
  className,
}) {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const tween = gsap.to(el, {
      scale: maxScale,
      opacity: 0.92,
      duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => tween.kill();
  }, [duration, maxScale]);

  return (
    <div
      className={`absolute pointer-events-none ${className ?? ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        ref={glowRef}
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${color} 0%, ${midColor} 35%, transparent 70%)`,
          mixBlendMode: "screen",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
