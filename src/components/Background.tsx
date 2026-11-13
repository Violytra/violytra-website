import { motion } from "framer-motion";

/** Quiet ambient motion: a slowly drifting grid and a few faint floating dots. */
export function AnimatedBackground() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: (i * 53) % 100,
    size: 1.5 + ((i * 7) % 3),
    duration: 16 + ((i * 11) % 14),
    delay: -((i * 5) % 16),
  }));

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 30% 20%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 20%, black, transparent)",
        }}
        animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full bg-violet-500/10 blur-[120px]"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute bottom-0 rounded-full bg-violet-300/40"
          style={{ left: `${d.left}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -900], opacity: [0, 0.8, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, ease: "linear", delay: d.delay }}
        />
      ))}
    </div>
  );
}
