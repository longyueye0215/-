/**
 * 分区页宇宙背景（纯 CSS）
 * 星云渐变 + 静态星点，无 RAF 开销
 */
export default function SectionBackdrop() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(ellipse 45% 40% at 88% 18%, rgba(79,70,229,0.10), transparent 60%), radial-gradient(ellipse 50% 45% at 8% 72%, rgba(56,189,248,0.08), transparent 60%), #05070c",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 25px 35px, rgba(255,255,255,0.75), transparent), radial-gradient(1px 1px at 130px 95px, rgba(200,230,255,0.55), transparent), radial-gradient(1.5px 1.5px at 210px 170px, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 60px 200px, rgba(180,215,255,0.5), transparent)",
          backgroundSize: "280px 280px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
