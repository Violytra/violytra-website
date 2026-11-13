import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowSquareOut, DownloadSimple, GitBranch, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";

const REPO = "https://github.com/Violytra/violytra-community-plugins";
const INDEX_URL = "https://plugins.violytra.cc.cd/index.json";

export interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  url?: string;
  homepage?: string;
  tags: string[];
}

interface RepoIndex {
  name?: string;
  description?: string;
  plugins?: Record<string, RawPlugin> | RawPlugin[];
}

type RawPlugin = Record<string, unknown>;

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

/** Accepts plugins as either a keyed object or an array, and tolerates missing fields. */
function normalize(index: RepoIndex): Plugin[] {
  const raw = index.plugins ?? {};
  const entries: [string, RawPlugin][] = Array.isArray(raw)
    ? raw.map((p, i) => [str(p.id, str(p.name, String(i))), p])
    : Object.entries(raw);

  return entries
    .map(([key, p]) => {
      const author =
        typeof p.author === "string"
          ? p.author
          : typeof (p.author as { name?: unknown })?.name === "string"
            ? ((p.author as { name: string }).name)
            : "Unknown";
      const tags = Array.isArray(p.tags) ? p.tags.filter((t): t is string => typeof t === "string") : [];

      // Support both flat manifests and channel/versioned indexes (plugin-cli format)
      let version = str(p.version, "");
      let url = str(p.url || p.download || p.file) || undefined;
      const channels = p.channels as Record<string, unknown> | undefined;
      const versions = p.versions as Record<string, Record<string, unknown>> | undefined;
      if (channels && versions) {
        const latest = str(channels.latest, str(channels.stable, Object.keys(versions)[0] ?? ""));
        if (latest) {
          version = latest;
          const v = versions[latest];
          if (v) url = str(v.url) || url;
        }
      }

      return {
        id: key,
        name: str(p.name, key),
        description: str(p.description, "No description provided."),
        author,
        version,
        url,
        homepage: str(p.homepage || p.repo || p.source) || undefined,
        tags,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function MaterialLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16">
      <motion.div
        className="h-14 w-14 bg-gradient-to-br from-violet-400 to-fuchsia-400 shadow-lg shadow-violet-500/20"
        animate={{
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "58% 42% 35% 65% / 52% 48% 52% 48%",
            "70% 30% 30% 70% / 70% 70% 30% 30%",
            "42% 58% 65% 35% / 48% 52% 48% 52%",
            "30% 70% 70% 30% / 30% 30% 70% 70%",
          ],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.06, 1, 1.06, 1],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="text-sm font-medium tracking-wide text-zinc-400">Loading plugins…</p>
    </div>
  );
}

function PluginCard({ plugin }: { plugin: Plugin }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-violet-400/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">{plugin.name}</h3>
          <p className="mt-1 truncate text-xs text-zinc-500">
            by {plugin.author}
            {plugin.version && ` · v${plugin.version}`}
          </p>
        </div>
        {plugin.tags[0] && (
          <span className="shrink-0 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-medium text-violet-300">
            {plugin.tags[0]}
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">{plugin.description}</p>
      <div className="mt-5 flex gap-2">
        {plugin.url && (
          <a
            href={plugin.url}
            target="_blank"
            rel="noreferrer"
            className="m3-shape inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            <DownloadSimple className="h-3.5 w-3.5" weight="bold" /> Install
          </a>
        )}
        {plugin.homepage && (
          <a
            href={plugin.homepage}
            target="_blank"
            rel="noreferrer"
            className="m3-shape inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-white/10"
          >
            <ArrowSquareOut className="h-3.5 w-3.5" /> Source
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function Plugins() {
  const [plugins, setPlugins] = useState<Plugin[] | null>(null);
  const [repoMeta, setRepoMeta] = useState<{ name?: string; description?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(INDEX_URL, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<RepoIndex>;
      })
      .then((data) => {
        setRepoMeta({ name: data.name, description: data.description });
        setPlugins(normalize(data));
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setPlugins([]);
      });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!plugins) return [];
    if (!q) return plugins;
    return plugins.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [plugins, query]);

  const loading = plugins === null;

  return (
    <section id="plugins" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Community plugins</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            {repoMeta.description ?? "Extensions built by the Violytra community, loaded live from the plugin repository."}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plugins…"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-400/50 focus:bg-white/10"
          />
        </div>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="m3-shape inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
        >
          <GitBranch className="h-4 w-4" /> Contribute a plugin
        </a>
      </Reveal>

      <div className="mt-10">
        {loading && <MaterialLoader />}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/5 p-10 text-center">
            <WarningCircle className="h-8 w-8 text-red-400" />
            <p className="text-zinc-300">Couldn't load the plugin index ({error}).</p>
            <a href={REPO} target="_blank" rel="noreferrer" className="text-sm text-violet-300 underline underline-offset-4">
              Browse the repository on GitHub
            </a>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-zinc-300">
              {plugins && plugins.length === 0 ? "No plugins have been published yet." : "No plugins match your search."}
            </p>
            {plugins && plugins.length === 0 && (
              <p className="mt-2 text-sm text-zinc-500">Be the first to add one to the repository.</p>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <PluginCard key={p.id} plugin={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
