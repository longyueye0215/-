import { useEffect, useMemo, useRef, useState } from "react";
import "./HexLoader.css";

/* ============================================================
   HexLoader —— 全屏 sci-fi 六边形加载页
   L0 暗场渐晕 / L1 二进制底纹 / L2 平顶六边形网格（Canvas）
   L3 中央光圈加载器（内联 SVG）+ 正弦波 + 状态行
   收尾：网格按「距中心越远越晚消失」逐格溶解，露出真实页面。

   调参指南：
   - duration  总时长(ms)，默认 1000；内部各阶段按比例缩放
   - hexSize   六边形外接圆半径 px（平顶：单格宽 = 2×hexSize），默认 86
   - brand     加载器下方的品牌/站名文字
   - accent    呼吸高亮格子的颜色（"R,G,B" 字符串），默认冷白偏紫
   - onDone    动画结束回调；不传则播完自行隐藏
   ============================================================ */

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

/* 时间轴关键比例（× duration）：0 → 网格淡入 → 加载 → 逐格溶解 → 结束 */
const IN_END = 0.14;      // 网格淡入完成
const CORE_IN = 0.10;     // 加载器开始出现
const CORE_FADE = 0.10;   // 加载器淡入时长
const PROG_FROM = 0.12;   // 进度起点
const PROG_TO = 0.58;     // 进度终点 = 溶解起点
const OUT_START = 0.58;   // 开始溶解

export default function HexLoader({
  brand = "LONGYUEYE—ARCHIVE",
  duration = 1000,
  hexSize = 86,
  accent = "165,180,252",
  onDone,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const veilRef = useRef(null);
  const binRef = useRef(null);
  const coreRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const waveRef = useRef(null);

  /* onDone 用 ref 保存，避免父组件重渲染导致时间轴重启 */
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  const [reduced] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  /* L1：二进制底纹（40 列，每列随机 0/1 与闪烁延迟） */
  const columns = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      delay: (Math.random() * 4).toFixed(2) + "s",
      chars: Array.from({ length: 30 }, () => (Math.random() > 0.5 ? "1" : "0")).join("\n"),
    }));
  }, []);

  useEffect(() => {
    if (reduced) {
      doneRef.current?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const core = coreRef.current;
    const veil = veilRef.current;
    const bin = binRef.current;

    /* 支持 ?t=毫秒 冻结单帧，方便验收截图（不传则正常播放） */
    const frozenParam = new URLSearchParams(window.location.search).get("t");
    const frozen = frozenParam !== null ? Number(frozenParam) || 0 : null;

    let cells = [];
    let dpr = 1;

    let VW = 0, VH = 0;

    const build = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      const w = Math.round(rect?.width || window.innerWidth);
      const h = Math.round(rect?.height || window.innerHeight);
      VW = w; VH = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const R = w < 768 ? 56 : hexSize;   // 移动端缩格，避免格子过多糊成一片
      const W = R * 2;
      const H = Math.sqrt(3) * R;
      const cols = Math.ceil(w / (R * 1.5)) + 2;
      const rows = Math.ceil(h / H) + 2;
      const cx0 = w / 2;
      const cy0 = h / 2;
      const maxD = Math.hypot(cx0, cy0);

      cells = [];
      for (let c = -1; c < cols; c++) {
        for (let r = -1; r < rows; r++) {
          const cx = c * R * 1.5;
          const cy = r * H + (c % 2 ? H / 2 : 0);
          cells.push({
            cx,
            cy,
            d: Math.hypot(cx - cx0, cy - cy0) / maxD,  // 0=中心 1=角落
            rnd: Math.random(),
            seed: Math.random() * 6.28,
            hot: Math.random() > 0.95,                 // 5% 呼吸高亮
          });
        }
      }
      return { R, W };
    };

    /* 状态：由时间轴驱动，Canvas 每帧读取 */
    const st = { alpha: 0, dissolve: 0 };
    let lastEl = frozen ?? 0;
    let lastNow = frozen ?? 0;

    let { R } = build();

    /* resize 会重置 canvas 尺寸（等于清空），所以必须重画一帧 */
    const renderFrame = () => { applyState(lastEl, lastNow); drawGrid(lastNow); };
    const onResize = () => { R = build().R; renderFrame(); };
    window.addEventListener("resize", onResize);

    const hexPath = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    };

    const drawGrid = (now) => {
      ctx.clearRect(0, 0, VW, VH);
      ctx.lineWidth = 1;

      for (const c of cells) {
        // 逐格溶解：距中心越远，消失越晚
        const k = clamp01((st.dissolve - (c.d * 0.5 + c.rnd * 0.18)) / 0.3);
        // 基础亮度（边缘亮、中心暗）+ 5% 格子的呼吸高亮
        const breathe = c.hot ? 0.11 * (0.5 + 0.5 * Math.sin(now / 700 + c.seed)) : 0;
        const a = (st.alpha * (0.13 + 0.24 * (1 - c.d)) + breathe) * (1 - k);
        if (a <= 0.004) continue;

        ctx.strokeStyle = c.hot
          ? `rgba(${accent},${Math.min(a, 1).toFixed(3)})`
          : `rgba(196,210,255,${Math.min(a, 1).toFixed(3)})`;
        hexPath(c.cx, c.cy, R * (1 - k * 0.06));
        ctx.stroke();
      }
    };

    const drawWave = (phase, amp) => {
      const path = waveRef.current;
      if (!path) return;
      let d = "";
      for (let x = 0; x <= 190; x += 2) {
        const y = 11 + Math.sin(x / 12 + phase) * amp * (0.55 + 0.45 * Math.sin(x / 60 + phase * 0.5));
        d += (x ? "L" : "M") + x + " " + y.toFixed(2) + " ";
      }
      path.setAttribute("d", d);
    };

    const applyState = (el, now) => {
      const t = clamp01(el / duration);

      // L2 网格淡入
      st.alpha = 0.92 * easeOut(clamp01(t / IN_END));

      // L3 加载器出现 / 进度
      const appear = clamp01((t - CORE_IN) / CORE_FADE);
      const p = clamp01((t - PROG_FROM) / (PROG_TO - PROG_FROM));
      core.style.opacity = String(easeOut(appear));
      if (barRef.current) barRef.current.style.width = (p * 100).toFixed(1) + "%";
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 99)).padStart(2, "0");
      drawWave(now / 220, 5 + 3 * Math.sin(now / 900));

      // 溶解：底噪先撤，网格后碎
      if (t > OUT_START) {
        const k = clamp01((t - OUT_START) / (1 - OUT_START));
        st.dissolve = Math.min(1.35, k * 1.35);
        const veilFade = Math.max(0, 1 - k / 0.3);
        if (veil) veil.style.opacity = String(veilFade);
        if (bin) bin.style.opacity = String(0.55 * veilFade);
        core.style.opacity = String(Math.max(0, 1 - k / 0.55));
      }
    };

    let raf = 0;
    let skipped = false;
    const start = performance.now();
    const finish = () => {
      st.alpha = 0;
      st.dissolve = 1.4;
      drawGrid(performance.now());
      ctx.clearRect(0, 0, VW, VH);
      core.style.opacity = "0";
      if (veil) veil.style.opacity = "0";
      if (bin) bin.style.opacity = "0";
      doneRef.current?.();
    };

    const loop = (now) => {
      const el = skipped ? duration : frozen !== null ? frozen : now - start;
      lastEl = el; lastNow = now;
      applyState(el, now);
      drawGrid(now);
      if (el >= duration) { finish(); return; }
      raf = requestAnimationFrame(loop);
    };

    if (frozen !== null) {
      // 冻结帧：用 frozen 当 now，保证逐帧录制时波形/呼吸可复现；多画一帧兜底布局抖动
      renderFrame();
      requestAnimationFrame(renderFrame);
    } else {
      raf = requestAnimationFrame(loop);
    }

    // 点击任意处 / Esc 立即跳过
    const skip = () => { skipped = true; };
    const onKey = (e) => { if (e.key === "Escape") skipped = true; };
    const root = rootRef.current;
    root?.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      root?.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, duration, hexSize, accent]);

  if (reduced) return null;

  return (
    <div className="hl-root" ref={rootRef} aria-hidden="true">
      {/* L0 暗场 */}
      <div className="hl-veil" ref={veilRef} />

      {/* L1 二进制底纹 */}
      <div className="hl-bin" ref={binRef}>
        {columns.map((c, i) => (
          <div key={i} style={{ animationDelay: c.delay, whiteSpace: "pre" }}>{c.chars}</div>
        ))}
      </div>

      {/* L2 六边形网格 */}
      <canvas className="hl-grid" ref={canvasRef} />

      {/* L3 中央加载器 */}
      <div className="hl-core" ref={coreRef}>
        <svg className="hl-aperture" viewBox="0 0 112 112" fill="none">
          <g className="hl-ticks" stroke="rgba(255,255,255,.22)" strokeWidth="1">
            <circle cx="56" cy="56" r="53" strokeDasharray="2 7" />
            <circle cx="56" cy="56" r="49" stroke="rgba(255,255,255,.10)" strokeDasharray="1 4" />
          </g>
          <g className="hl-blades">
            <circle cx="56" cy="56" r="33" fill="#f4f6fb" />
            <g stroke="#080a0c" strokeWidth="3">
              <path d="M56 23 L56 40" transform="rotate(38 56 56)" />
              <path d="M56 23 L56 40" transform="rotate(128 56 56)" />
              <path d="M56 23 L56 40" transform="rotate(218 56 56)" />
              <path d="M56 23 L56 40" transform="rotate(308 56 56)" />
            </g>
            <circle cx="56" cy="56" r="13" fill="#14161c" />
            <g fill="#2b2f3a">
              <circle cx="56" cy="41" r="2.1" /><circle cx="56" cy="71" r="2.1" />
              <circle cx="41" cy="56" r="2.1" /><circle cx="71" cy="56" r="2.1" />
              <circle cx="45.4" cy="45.4" r="2.1" /><circle cx="66.6" cy="66.6" r="2.1" />
              <circle cx="66.6" cy="45.4" r="2.1" /><circle cx="45.4" cy="66.6" r="2.1" />
            </g>
            <circle cx="56" cy="56" r="5.2" fill="#0b0d12" stroke="#c7d2fe" strokeWidth="1.1" />
          </g>
        </svg>

        <div className="hl-brand" data-txt={brand}>{brand}</div>

        <svg className="hl-wave" viewBox="0 0 190 22" fill="none">
          <path ref={waveRef} stroke="rgba(199,210,254,.75)" strokeWidth="1" />
        </svg>

        <div className="hl-status">
          <span>[ <b>LOADING</b> ]</span>
          <span className="hl-bar"><i ref={barRef} /></span>
          <span ref={pctRef}>00</span>
          <span>→ <b>ACCESS</b> SYSTEM<span className="hl-caret" /></span>
        </div>
      </div>
    </div>
  );
}
