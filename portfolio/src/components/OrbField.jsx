import { views } from "../data/views";

/**
 * 轨道小球选择器
 * 从「初音怀中的球体」向外展开若干小球，每颗代表一个分区
 * 同一套组件在开屏与分区内复用
 */
export default function OrbField({
  open = false,
  origin = { x: 45.5, y: 64.5 },
  radius = 200,
  onSelect,
}) {
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      {/* 轨道弧线 */}
      <div
        className="absolute rounded-full"
        style={{
          left: `${origin.x}%`,
          top: `${origin.y}%`,
          width: radius * 2,
          height: radius * 1.05,
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(150,200,255,0.16)",
          opacity: open ? 1 : 0,
          transition: "opacity .6s ease",
        }}
      />

      {views.map((v, i) => {
        const rad = (v.angle * Math.PI) / 180;
        const dx = Math.sin(rad) * radius;
        const dy = -Math.cos(rad) * radius * 0.52 - 46;
        return (
          <div
            key={v.id}
            className="absolute"
            style={{
              left: `calc(${origin.x}% + ${dx}px)`,
              top: `calc(${origin.y}% + ${dy}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              type="button"
              onClick={() => onSelect?.(v.id)}
              className="flex flex-col items-center gap-2"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "scale(1)" : "scale(0.35)",
                transition: `opacity .45s ease ${i * 70}ms, transform .5s cubic-bezier(.2,1.5,.4,1) ${i * 70}ms`,
                pointerEvents: open ? "auto" : "none",
                cursor: "pointer",
                background: "transparent",
                border: "none",
              }}
            >
              <span
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${v.color} 55%, rgba(8,16,32,0.95) 100%)`,
                  boxShadow: `0 0 26px ${v.color}99, inset 0 0 12px rgba(255,255,255,0.55)`,
                  display: "block",
                }}
              />
              <span
                className="text-[11px] tracking-[0.25em] text-white/85"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
              >
                {v.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
