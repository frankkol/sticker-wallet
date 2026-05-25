import { useEffect, useMemo, useState } from "react";
import { BookOpen, BarChart3, Download, Upload, Trophy, RotateCcw } from "lucide-react";
// import { useAlbum } from "@/lib/album-storage";
import { useAlbum } from "./lib/album-storage";
// import { type Album } from "@/lib/album-data";
import { type Album } from "./lib/album-data";
// import { WelcomeScreen } from "@/components/album/WelcomeScreen";
import { WelcomeScreen } from "./components/album/WelcomeScreen";
// import { ImportModal } from "@/components/album/ImportModal";
import { ImportModal } from "./components/album/ImportModal";
// import { CountryPage } from "@/components/album/CountryPage";
import { CountryPage } from "./components/album/CountryPage";
// import { Dashboard } from "@/components/album/Dashboard";
import { Dashboard } from "./components/album/Dashboard";
// import { SearchBar } from "@/components/album/SearchBar";
import { SearchBar } from "./components/album/SearchBar";
// import { cn } from "@/lib/utils";
import { cn } from "./lib/utils";

type View = "album" | "dashboard" | "export";

function App() {
  const { album, ready, create, importAlbum, reset, updateSticker } = useAlbum();
  const [view, setView] = useState<View>("album");
  const [countryIdx, setCountryIdx] = useState(0);
  const [importOpen, setImportOpen] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    if (!highlight) return;
    const t = setTimeout(() => setHighlight(null), 1800);
    return () => clearTimeout(t);
  }, [highlight]);

  const country = useMemo(() => album?.countries[countryIdx], [album, countryIdx]);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando…</div>;
  }

  if (!album) {
    return (
      <>
        <WelcomeScreen onCreate={create} onImport={() => setImportOpen(true)} />
        <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={importAlbum} />
      </>
    );
  }

  const goPrev = () => setCountryIdx((i) => (i - 1 + album.countries.length) % album.countries.length);
  const goNext = () => setCountryIdx((i) => (i + 1) % album.countries.length);

  const handleImport = (data: Album) => {
    if (confirm("Isso substituirá sua carteira atual. Deseja continuar?")) {
      importAlbum(data);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(album, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `album-2026-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onSearchSelect = (countryId: string, code: string) => {
    const idx = album.countries.findIndex((c) => c.id === countryId);
    if (idx >= 0) {
      setCountryIdx(idx);
      setView("album");
      setHighlight(code);
      setTimeout(() => {
        document.getElementById("album-top")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={importAlbum} />

      <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3 sm:pt-5">
        <nav className="glass-strong rounded-full shadow-card px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 shrink-0 pl-1">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center shadow-glow"
              style={{ background: "var(--gradient-hero)" }}>
              <Trophy className="h-4 w-4 text-background" />
            </div>
            <span className="font-bold hidden sm:inline">Album 2026</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-secondary/40 rounded-full p-1">
            <NavTab active={view === "album"} onClick={() => setView("album")} icon={<BookOpen className="h-4 w-4" />} label="Carteira" />
            <NavTab active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<BarChart3 className="h-4 w-4" />} label="Indicadores" />
            <NavTab active={view === "export"} onClick={() => { setView("export"); handleExport(); }} icon={<Download className="h-4 w-4" />} label="Exportar" />
            <NavTab active={false} onClick={() => setImportOpen(true)} icon={<Upload className="h-4 w-4" />} label="Upload" />
          </div>

          <div className="flex-1" />

          <SearchBar album={album} onSelect={onSearchSelect} />

          <button
            onClick={() => { if (confirm("Apagar carteira atual?")) reset(); }}
            className="flex-1 h-9 w-9 rounded-full bg-secondary/40 hover:bg-destructive/30 hover:text-destructive items-center justify-center transition shrink-0"
            title="Resetar"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </nav>
      </header>

      {/* <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3 sm:pt-5">
        <div className="glass-strong rounded-full shadow-card px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 shrink-0 pl-1">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center shadow-glow"
                 style={{ background: "var(--gradient-hero)" }}>
              <Trophy className="h-4 w-4 text-background" />
            </div>
            <span className="font-bold hidden sm:inline">Album 2026</span>
            <div className="flex gap-2">
              <button
                onClick={() => setView("album")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  view === "album"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Album</span>
              </button>
              <button
                onClick={() => setView("dashboard")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  view === "dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => setView("export")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  view === "export"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {view === "album" && (
            <SearchBar album={album} onSelect={onSearchSelect} />
            // <SearchBar
            //   countries={album.countries}
            //   current={countryIdx}
            //   onSelect={setCountryIdx}
            // />
          )}
        </div>
      </header> */}

      {/* <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-4 py-6 w-full flex flex-col">
          {view === "album" && country ? (
            <>
              <CountryPage
                album={album}
                country={country}
                onPrev={goPrev}
                onNext={goNext}
                onPositive={(code) => updateSticker(code, { positive: +1 })}
                onNegative={(code) => updateSticker(code, { negative: -1 })}
                highlightCode={highlight}
              />
              <div className="mt-6 flex gap-2 justify-center">
                <button
                  onClick={() => importAlbum(album)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </button>
                <button
                  onClick={() => setImportOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-accent transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={() => {
                    if (confirm("Tem certeza que deseja resetar o album?")) {
                      reset();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </>
          ) : view === "dashboard" ? (
            <Dashboard album={album} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Funcionalidade de export em desenvolvimento</p>
              </div>
            </div>
          )}
        </div>
      </main> */}
      <main id="album-top" className="max-w-6xl mx-auto px-3 sm:px-6 pt-6">
        {view === "album" && country && (
          <CountryPage
            album={album}
            country={country}
            onPrev={goPrev}
            onNext={goNext}
            onPositive={(code) => updateSticker(code, { positive: +1 })}
            onNegative={(code) => updateSticker(code, { negative: -1 })}
            highlightCode={highlight}
          />
        )}
        {view === "dashboard" && <Dashboard album={album} />}
        {view === "export" && (
          <div className="glass rounded-3xl p-8 text-center shadow-card max-w-md mx-auto mt-12">
            <Download className="h-12 w-12 mx-auto mb-4 text-success" />
            <h2 className="text-2xl font-bold mb-2">Carteira exportada</h2>
            <p className="text-sm text-muted-foreground mb-6">O download começou automaticamente.</p>
            <button
              onClick={handleExport}
              className="h-11 px-6 rounded-full font-semibold text-primary-foreground shadow-glow transition active:scale-95"
              style={{ background: "var(--gradient-hero)" }}
            >
              Baixar novamente
            </button>
          </div>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-full shadow-card p-1.5 flex items-center justify-around">
        <NavTab active={view === "album"} onClick={() => setView("album")} icon={<BookOpen className="h-5 w-5" />} label={view === "album" ? "" : "Carteira"} />
        <NavTab active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<BarChart3 className="h-5 w-5" />} label={view === "dashboard" ? "" : "Dados"} />
        <NavTab active={view === "export"} onClick={() => { setView("export"); handleExport(); }} icon={<Download className="h-5 w-5" />} label={view === "export" ? "" : "Exportar"} />
        <NavTab active={false} onClick={() => setImportOpen(true)} icon={<Upload className="h-5 w-5" />} label="Upload" />
      </nav>

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
    </div>
  );
}

function NavTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 px-3 sm:px-4 rounded-full flex items-center gap-2 text-sm font-medium transition",
        active
          ? "bg-foreground text-background shadow-glow"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default App;
