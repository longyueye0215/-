import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Strengths from "./components/Strengths";
import Contact from "./components/Contact";
import Lightfall from "./components/Lightfall";

export default function App() {
  return (
    <div className="relative bg-dark-950 min-h-screen">
      <Navbar />
      <main>
        <Hero />

        {/* Lightfall 光流背景包裹内容区 */}
        <div className="relative">
          <Lightfall
            colors={["#6366f1", "#818cf8", "#4f46e5"]}
            backgroundColor="#080a0c"
            speed={0.3}
            streakCount={3}
            streakWidth={1}
            streakLength={1}
            glow={0.6}
            density={0.35}
            twinkle={0.6}
            zoom={3}
            backgroundGlow={0.15}
            opacity={0.4}
            mouseInteraction={true}
            mouseStrength={0.3}
            mouseRadius={0.8}
            mouseDampening={0.2}
          />
          <About />
          <Experience />
          <Projects />
          <Strengths />
        </div>

        <Contact />
      </main>
    </div>
  );
}
