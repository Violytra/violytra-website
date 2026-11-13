import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Violytra site error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <DownScreen />;
    }
    return this.props.children;
  }
}

export function DownScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6 text-center text-white">
      <div className="max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 text-2xl font-bold text-violet-300">
          V
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Violytra is down right now</h1>
        <p className="mt-3 text-zinc-400">Something went wrong loading the site. Please try again in a moment.</p>
        <button
          onClick={() => window.location.reload()}
          className="m3-shape mt-8 inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
