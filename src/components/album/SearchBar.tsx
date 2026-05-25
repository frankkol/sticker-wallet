import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
// import type { Album } from "@/lib/album-data";
import type { Album } from "../../lib/album-data";
// import { stickerStatus } from "@/lib/album-data";
import { stickerStatus  } from "../../lib/album-data";

type Result = {
  code: string;
  name: string;
  countryName: string;
  countryFlag: string;
  countryId: string;
  page: number;
  status: "owned" | "missing" | "extras";
  extras: number;
};

export function SearchBar({ album, onSelect }: { album: Album; onSelect: (countryId: string, code: string) => void }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const allStickers = useMemo<Result[]>(() => {
    const list: Result[] = [];
    for (const c of album.countries) {
      for (const s of c.stickers) {
        list.push({
          code: s.code,
          name: s.name,
          countryName: c.name,
          countryFlag: c.flag,
          countryId: c.id,
          page: s.page,
          status: stickerStatus(s),
          extras: s.positiveQty,
        });
      }
    }
    return list;
  }, [album]);

  const results = useMemo(() => {
    if (!debounced) return [];
    return allStickers
      .filter(
        (r) =>
          r.code.toLowerCase().includes(debounced) ||
          r.name.toLowerCase().includes(debounced) ||
          r.countryName.toLowerCase().includes(debounced),
      )
      .slice(0, 20);
  }, [allStickers, debounced]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar figurinha, jogador, país…"
          className="w-full h-10 pl-10 pr-10 rounded-full glass text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && debounced && (
        <div className="absolute top-12 left-0 right-0 glass-strong rounded-2xl shadow-card max-h-[60vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">Nada encontrado</p>
          ) : (
            <ul className="p-2 space-y-1">
              {results.map((r) => (
                <li key={r.code}>
                  <button
                    onClick={() => {
                      onSelect(r.countryId, r.code);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/60 transition text-left"
                  >
                    <span className="text-2xl">{r.countryFlag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{r.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{r.code}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.countryName} • Página {String(r.page).padStart(2, "0")}
                      </p>
                    </div>
                    <StatusPill status={r.status} extras={r.extras} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, extras }: { status: Result["status"]; extras: number }) {
  if (status === "missing") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">Faltando</span>;
  if (status === "extras") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-[--color-gold]/20 text-[--color-gold]">+{extras}</span>;
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/20 text-success">Completa</span>;
}
