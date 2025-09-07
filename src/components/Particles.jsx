import { useEffect } from "react";

function Particles() {
  useEffect(() => {
    // Create particles dynamically
    const container = document.querySelector(".particles-container");
    if (!container) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particle.style.animationDuration = `${6 + Math.random() * 4}s`;
      container.appendChild(particle);
    }

    return () => {
      // Cleanup
      const particles = container.querySelectorAll(".particle");
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  return <div className="particles-container"></div>;
}

export default Particles;
