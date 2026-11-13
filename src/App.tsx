import { useState } from "react";
import violytraIcon from "./assets/violytra-icon.png";
import { AnimatePresence, motion, useScroll, useSpring, useAnimationFrame } from "framer-motion";
import { AnimatedBackground } from "./components/Background";
import {
  ArrowRight,
  ArrowUpRight,
  GithubLogo,
  List,
  X,
} from "@phosphor-icons/react";
import { Reveal } from "./components/Reveal";
import { Plugins } from "./components/Plugins";
import { ThemePicker } from "./components/ThemePicker";

type Platform = "android" | "ios";

interface Build {
  id: string;
  title: string;
  summary: string;
  href: string;
  requirement: string;
  steps: string[];
}

const builds: Record<Platform, Build[]> = {
  android: [
    {
      id: "manager",
      title: "Violytra Manager",
      summary: "Patches and installs Violytra on your device.",
      href: "https://github.com/Violytra/violytra-manager/releases/latest",
      requirement: "No root",
      steps: [
        "Install the Manager APK.",
        "Accept the storage permissions, then click Install.",
        "Tap Patch & Install.",
      ],
    },
    {
      id: "xposed",
      title: "Violytra Xposed",
      summary: "Xposed / LSPosed module for rooted devices.",
      href: "https://github.com/Violytra/violytra-xposed/releases/latest",
      requirement: "Root + LSPosed",
      steps: [
        "Install the Xposed framework (LSPosed).",
        "Install the Violytra module APK.",
        "Enable it, scope it to Discord, and reboot.",
      ],
    },
  ],
  ios: [
    {
      id: "ipa",
      title: "Violytra IPA",
      summary: "Patched Discord build for sideloading.",
      href: "https://github.com/Violytra/violytra-mod/actions/runs/43228182689/artifacts/13949607743",
      requirement: "No jailbreak",
      steps: [
        "Download the IPA to a computer.",
        "Sideload it with AltStore, Sideloadly, or Feather.",
        "Trust the developer profile and open Discord.",
      ],
    },
    {
      id: "deb",
      title: "Violytra Tweak",
      summary: "Rootless .deb tweak for jailbroken devices.",
      href: "https://github.com/Violytra/violytra-mod/actions/runs/43228182689/artifacts/13951030147",
      requirement: "Jailbreak",
      steps: [
        "Move the .deb file to your device.",
        "Install it with Sileo, Zebra, or Filza.",
        "Respring, then relaunch Discord.",
      ],
    },
  ],
};

const features: { title: string; text: string }[] = [
  { title: "Themes", text: "Change colors and surfaces across the app." },
  { title: "Plugins", text: "Add community plugins from an open repository." },
  { title: "Lightweight", text: "Small patches. No background services." },
  { title: "Open source", text: "Read the code, file issues, send changes." },
];

const navLinks = [
  { href: "#install", label: "Install" },
  { href: "#features", label: "Features" },
  { href: "#plugins", label: "Plugins" },
];

const cyclingWords = ["themes", "plugins", "your style", "everything"];

function CyclingWord() {
  const [i, setI] = useState(0);
  useAnimationFrame((t) => {
    const idx = Math.floor(t / 2600) % cyclingWords.length;
    if (idx !== i) setI(idx);
  });
  const word = cyclingWords[i];
  return (
    <motion.span
      layout
      transition={{ layout: { type: "spring", stiffness: 400, damping: 30 } }}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-1 align-middle"
    >
      {/* Invisible sizer keeps the box sized to the current word for smooth resizing */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {word}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-violet-300"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-violet-400" style={{ scaleX }} />
  );
}

function Mark() {
  return <img src={violytraIcon} alt="Violytra" className="h-7 w-7 rounded-md" />;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0c0c10]/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <Mark />
          <span className="font-semibold tracking-tight text-zinc-100">Violytra</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
              {l.label}
            </a>
          ))}
          <span className="h-5 w-px bg-white/10" />
          <ThemePicker />
        </div>

        <button
          className="rounded-md p-2 text-zinc-300 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 text-zinc-300">
                  {l.label}
                </a>
              ))}
              <div className="pt-3">
                <ThemePicker />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pt-32">
      <Reveal>
        <p className="text-sm font-medium text-violet-300">Discord client mod for Android and iOS</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-50 sm:text-6xl">
          Discord, tuned with{" "}
          <CyclingWord />
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          Violytra adds themes and plugins to the Discord app on your phone. Choose the build for your device and
          follow the short setup.
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#install"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
          >
            Install Violytra
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
          <a
            href="https://github.com/Violytra"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-zinc-100"
          >
            <GithubLogo className="h-4 w-4" />
            Source on GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Install() {
  const [platform, setPlatform] = useState<Platform>("android");
  return (
    <section id="install" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Install</h2>
            <p className="mt-2 text-zinc-400">Pick your platform, then the method that matches your device.</p>
          </div>
          <div className="inline-flex w-fit rounded-lg border border-white/10 bg-white/[0.03] p-1">
            {(["android", "ios"] as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  platform === p ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={platform}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]"
        >
          {builds[platform].map((b) => (
            <div key={b.id} className="grid gap-6 py-8 md:grid-cols-[1fr_1.2fr_auto] md:items-start md:gap-10">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-zinc-100">{b.title}</h3>
                  <span className="rounded bg-white/[0.06] px-2 py-0.5 text-xs text-zinc-400">{b.requirement}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">{b.summary}</p>
              </div>
              <ol className="space-y-2 text-sm text-zinc-300">
                {b.steps.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.1 }}
                    className="flex gap-3"
                  >
                    <span className="w-4 shrink-0 text-zinc-600 tabular-nums">{i + 1}.</span>
                    {s}
                  </motion.li>
                ))}
              </ol>
              <a
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white"
              >
                Download
                <ArrowUpRight className="h-4 w-4" weight="bold" />
              </a>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">What it does</h2>
      </Reveal>
      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.04} className="bg-[#0c0c10] p-7">
            <div className="flex items-center gap-3">
              <span className="text-xs tabular-nums text-zinc-600">0{i + 1}</span>
              <h3 className="font-medium text-zinc-100">{f.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <Mark />
          <span className="text-sm font-medium text-zinc-300">Violytra</span>
        </div>
        <div className="flex gap-6 text-sm text-zinc-500">
          <a href="https://github.com/Violytra" target="_blank" rel="noreferrer" className="hover:text-zinc-200">
            GitHub
          </a>
          <a href="#install" className="hover:text-zinc-200">
            Install
          </a>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-6 pb-10 text-xs leading-relaxed text-zinc-600">
        Violytra is an unofficial project and is not affiliated with Discord Inc. Discord is a trademark of Discord Inc.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0c0c10] font-sans text-zinc-200 antialiased selection:bg-violet-500/30">
      <AnimatedBackground />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Install />
        <Features />
        <Plugins />
      </main>
      <Footer />
    </div>
  );
}
