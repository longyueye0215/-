import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import "./LottieLayer.css";

/**
 * Lottie 装饰层（A4）
 * 播放 sparkles.json（星点闪烁粒子），叠加于开屏之上
 */
export default function LottieLayer({
  src = "/lottie/sparkles.json",
  className,
  loop = true,
  autoplay = true,
  speed = 1,
  opacity = 0.9,
  mixBlendMode = "screen",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const anim = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop,
      autoplay,
      path: src,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: true,
      },
    });
    anim.setSpeed(speed);

    return () => anim.destroy();
  }, [src, loop, autoplay, speed]);

  return (
    <div
      ref={containerRef}
      className={`lottie-layer pointer-events-none ${className ?? ""}`}
      style={{ opacity, ...(mixBlendMode && { mixBlendMode }) }}
    />
  );
}
