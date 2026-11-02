import { useEffect, useRef } from "react";

/**
 * 星际穿越式 warp 转场（Canvas 2D）
 * 径向星流加速外扩 + 中心闪光 + 暗场遮蔽，用于视图切换
 * active 为 true 时播放一次；onMid 在中点触发（此时切换视图）；onDone 结束时触发
 */
export default function WarpTransition({ active, onMid, onDone }) {
  const canvasRef = useRef(null);
  const midRef = useRef(onMid);
  const doneRef = useRef(onDone);
  midRef.current = onMid;
  doneRef.current = onDone;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let w = 1;
    let h = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const cx = w * 0.48;
    const cy = h * 0.69;
    const maxR = Math.max(w, h) * 1.25;

    const N = 240;
    const streaks = new Array(N).fill(0).map(() => ({
      a: Math.random() * Math.PI * 2,
      r: 24 + Math.random() * maxR * 0.55,
      speed: 0.5 + Math.random() * 1.6,
      len: 10 + Math.random() * 40,
      cool: Math.random() > 0.45,
    }));

    const DURATION = 1050;
    const t0 = performance.now();
    let raf = 0;
    let midFired = false;

    const loop = (t) => {
      const p = Math.min(1, (t - t0) / DURATION);

      if (!midFired && p >= 0.48) {
        midFired = true;
        if (midRef.current) midRef.current();
      }
      if (p >= 1) {
        if (doneRef.current) doneRef.current();
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const dark = 0.18 + 0.62 * Math.min(1, p * 1.6);
      ctx.fillStyle = `rgba(2,6,14,${dark})`;
      ctx.fillRect(0, 0, w, h);

      const boost = Math.pow(p, 2.1) * 7;
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        const r1 = s.r;
        const r2 = Math.max(0, s.r - s.len * (0.4 + p * 2.4));
        const ca = Math.cos(s.a);
        const sa = Math.sin(s.a);
        const alpha = 0.12 + 0.72 * p;
        ctx.strokeStyle = s.cool
          ? `rgba(180,222,255,${alpha})`
          : `rgba(255,255,255,${alpha * 0.85})`;
        ctx.lineWidth = 1 + s.speed * 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + ca * r1, cy + sa * r1);
        ctx.lineTo(cx + ca * r2, cy + sa * r2);
        ctx.stroke();

        s.r += s.speed * boost * 7;
        if (s.r > maxR) {
          s.r = 20 + Math.random() * 40;
          s.a = Math.random() * Math.PI * 2;
        }
      }

      if (p > 0.5) {
        const fp = (p - 0.5) / 0.5;
        const rad = Math.max(w, h) * fp * 1.25;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, rad));
        const a = 0.95 * (1 - Math.abs(fp - 0.55) / 0.55);
        g.addColorStop(0, `rgba(235,248,255,${Math.max(0, a)})`);
        g.addColorStop(1, "rgba(235,248,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, rad), 0, 6.2832);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
