import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HexLoader from "./components/HexLoader";

function MockPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#080a0c", padding: "12vw 8vw", boxSizing: "border-box" }}>
      <h1 style={{ fontFamily: '"Inter","Noto Sans SC",sans-serif', fontSize: "clamp(32px,7vw,86px)",
                   lineHeight: 0.95, letterSpacing: "-.02em", margin: 0, color: "#e9ecef" }}>
        赵鹏 <span style={{ color: "#818cf8" }}>/ ZHAO PENG</span>
      </h1>
      <p style={{ maxWidth: "44ch", color: "#8b94a3", fontSize: 14, lineHeight: 1.7, marginTop: 18 }}>
        跨界的本质是好奇心的延展，每一次身份切换，都是对自我边界的重新丈量。
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(120px,1fr))", gap: 12, maxWidth: 760, marginTop: 26 }}>
        {[["100万+", "累计创作文字"], ["7", "重跨界身份"], ["N1", "日语能力"], ["2", "项目负责人"]].map(([v, l]) => (
          <div key={l} style={{ border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)",
                                borderRadius: 12, padding: 14 }}>
            <b style={{ display: "block", fontSize: 20, color: "#c7d2fe" }}>{v}</b>
            <i style={{ fontStyle: "normal", fontSize: 11, color: "#6c757d", letterSpacing: ".1em" }}>{l}</i>
          </div>
        ))}
      </div>
    </main>
  );
}

function Preview() {
  const [done, setDone] = useState(false);
  return (
    <>
      <MockPage />
      {!done && <HexLoader brand="LONGYUEYE—ARCHIVE" duration={1000} onDone={() => setDone(true)} />}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Preview />
  </StrictMode>
);
