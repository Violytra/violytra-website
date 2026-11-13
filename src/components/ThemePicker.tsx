import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "@phosphor-icons/react";
import { applyMaterialTheme, getSavedSeed, seedPresets } from "../theme/material";

/** Material You color picker: choose a seed color and the whole accent palette regenerates. */
export function ThemePicker() {
  const [seed, setSeed] = useState<string>(getSavedSeed);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyMaterialTheme(seed);
  }, [seed]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose theme color"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-violet-300 transition hover:bg-white/10"
      >
        <Palette className="h-5 w-5" weight="duotone" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-64 rounded-2xl border border-white/10 bg-[#14141f]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Material You</p>
            <p className="mt-1 text-sm text-zinc-300">Pick a seed color for your palette.</p>

            <div className="mt-4 grid grid-cols-6 gap-2">
              {seedPresets.map((p) => (
                <button
                  key={p.hex}
                  title={p.name}
                  aria-label={p.name}
                  onClick={() => setSeed(p.hex)}
                  style={{ backgroundColor: p.hex }}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-[#14141f] transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {seed.toLowerCase() === p.hex.toLowerCase() && (
                    <Check className="h-4 w-4 text-white drop-shadow" weight="bold" />
                  )}
                </button>
              ))}
            </div>

            <label className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
              Custom color
              <input
                type="color"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="h-7 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
