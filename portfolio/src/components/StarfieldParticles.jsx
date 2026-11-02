import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec2  iResolution;
uniform float iTime;
uniform vec2  iMouse;
uniform float uParallax;
uniform vec3  uStarColor;
uniform vec3  uMeteorColor;
uniform float uStarDensity;
uniform float uMeteorSpeed;
uniform float uOpacity;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float starLayer(vec2 p, float cells, float seed, float twSpeed) {
  vec2 gv = p * cells;
  vec2 id = floor(gv);
  vec2 f  = fract(gv);
  float h = hash21(id + seed);
  float present = step(1.0 - uStarDensity, h);
  vec2 c = vec2(hash21(id + seed + 1.13), hash21(id + seed + 2.71));
  float d = length(f - c);
  float tw = 0.55 + 0.45 * sin(iTime * twSpeed + h * 40.0);
  float core = smoothstep(0.14, 0.0, d);
  float halo = smoothstep(0.34, 0.0, d) * 0.22;
  return present * (core + halo) * tw * 1.25;
}

float meteor(vec2 p, float seed, float aspect) {
  float spd = uMeteorSpeed * (0.6 + 0.5 * hash21(vec2(seed, 3.0)));
  float life = fract(iTime * spd + seed * 0.37);
  vec2 dir = normalize(vec2(-1.0, -0.55));
  float startX = aspect * (0.55 + 0.75 * hash21(vec2(seed, 1.0)));
  float startY = 0.55 + 0.42 * hash21(vec2(seed, 2.0));
  vec2 head = vec2(startX, startY) + dir * life * (aspect + 1.0) * 0.9;
  vec2 rel = p - head;
  float along = dot(rel, dir);
  float perp  = abs(rel.x * dir.y - rel.y * dir.x);
  float tail = 0.20 + 0.12 * hash21(vec2(seed, 4.0));
  float streak = smoothstep(tail, 0.0, -along) * smoothstep(0.022, 0.0, perp);
  float fade = sin(life * 3.14159265);
  return streak * fade;
}

void main() {
  float aspect = iResolution.x / max(iResolution.y, 1.0);
  vec2 p = vUv;
  p.x *= aspect;
  p += iMouse * uParallax;

  float s = 0.0;
  s += starLayer(p, 60.0, 0.0, 1.6) * 0.55;
  s += starLayer(p, 32.0, 11.7, 1.1) * 0.80;
  s += starLayer(p, 16.0, 23.3, 0.7) * 1.00;

  float m = 0.0;
  m += meteor(p, 1.0, aspect);
  m += meteor(p, 2.0, aspect);
  m += meteor(p, 3.0, aspect);
  m += meteor(p, 4.0, aspect);

  vec3 col = uStarColor * s + uMeteorColor * m;
  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  gl_FragColor = vec4(col, a * uOpacity);
}
`;

const hexToRGB = (hex) => {
  const c = hex.replace("#", "").padEnd(6, "0");
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ];
};

/**
 * 银河星点 + 流星粒子层（OGL 全屏 shader）
 * 叠加在开屏底图之上，与底图无关，可独立控制密度/速度/配色
 */
export default function StarfieldParticles({
  className,
  dpr,
  starColor = "#cfe4ff",
  meteorColor = "#8fd0ff",
  starDensity = 0.34,
  meteorSpeed = 0.16,
  opacity = 1.0,
  parallax = 0.035,
  mouseParallax = true,
  mixBlendMode = "screen",
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseTargetRef = useRef([0, 0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: dpr ?? (typeof window !== "undefined" ? Math.min(1.5, window.devicePixelRatio || 1) : 1),
      alpha: true,
      antialias: false,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;
    gl.clearColor(0, 0, 0, 0);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iTime: { value: 0 },
      iMouse: { value: [0, 0] },
      uParallax: { value: parallax },
      uStarColor: { value: hexToRGB(starColor) },
      uMeteorColor: { value: hexToRGB(meteorColor) },
      uStarDensity: { value: starDensity },
      uMeteorSpeed: { value: meteorSpeed },
      uOpacity: { value: opacity },
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;
    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
      mouseTargetRef.current = [nx, -ny];
    };
    if (mouseParallax) {
      window.addEventListener("pointermove", onPointerMove);
    }

    let isVisible = true;
    const loop = (t) => {
      rafRef.current = isVisible ? requestAnimationFrame(loop) : null;
      if (!isVisible) return;
      uniforms.iTime.value = t * 0.001;
      const target = mouseTargetRef.current;
      const cur = uniforms.iMouse.value;
      cur[0] += (target[0] - cur[0]) * 0.06;
      cur[1] += (target[1] - cur[1]) * 0.06;
      if (programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (err) {
          console.error(err);
        }
      }
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const wasVisible = isVisible;
        isVisible = entries.some((e) => e.isIntersecting);
        if (isVisible && !wasVisible && !rafRef.current) {
          rafRef.current = requestAnimationFrame(loop);
        } else if (!isVisible && rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      visibilityObserver.disconnect();
      if (mouseParallax) window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) container.removeChild(canvas);
      const callIfFn = (obj, key) => {
        const fn = obj && obj[key];
        if (typeof fn === "function") fn.call(obj);
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [dpr, starColor, meteorColor, starDensity, meteorSpeed, opacity, parallax, mouseParallax]);

  return (
    <div
      ref={containerRef}
      className={`starfield-container ${className ?? ""}`}
      style={{ ...(mixBlendMode && { mixBlendMode }) }}
    />
  );
}
