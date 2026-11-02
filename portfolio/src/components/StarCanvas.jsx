import { useEffect, useRef } from "react";

/**
 * Canvas 2D 星野：闪烁星点 + 周期流星
 * 不依赖 WebGL，任何浏览器/预览环境都能渲染
 */
export default function StarCanvas({ className, density = 0.00016, meteorRate = 0.5 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let w = 1;
    let h = 1;
    let stars = [];
    let meteors = [];
    let raf = 0;
    let visible = true;
    let last = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(260, Math.max(60, Math.floor(w * h * density)));
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.2,
        p: Math.random() * Math.PI * 2,
        s: 0.7 + Math.random() * 1.8,
      }));
    };

    const spawnMeteor = () => {
      const speed = 460 + Math.random() * 300;
      const ang = Math.PI * (0.70 + Math.random() * 0.14);
      meteors.push({
        x: Math.random() * w * 1.15,
        y: -30 - Math.random() * h * 0.25,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life: 1.5 + Math.random() * 0.9,
        maxLife: 2.4,
        width: 1.2 + Math.random() * 1.6,
      });
    };

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (!last) last = t;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.0016 * s.s + s.p));
        ctx.globalAlpha = tw;
        ctx.fillStyle = "rgba(205,232,255,1)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (Math.random() < meteorRate * dt) spawnMeteor();
      meteors = meteors.filter((m) => m.life > 0);
      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life -= dt;
        const a = Math.max(0, m.life / m.maxLife);
        const tailX = m.x - m.vx * 0.1;
        const tailY = m.y - m.vy * 0.1;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(200,235,255,${0.95 * a})`);
        grad.addColorStop(1, "rgba(200,235,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible && !raf) raf = requestAnimationFrame(loop);
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    raf = requestAnimationFrame(loop);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [density, meteorRate]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
    />
  );
}
