import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
// import type { Album, Country } from "@/lib/album-data";
import type { Album, Country } from "../../lib/album-data";
import { StickerCard } from "./StickerCard";

type Props = {
  album: Album;
  country: Country;
  onPrev: () => void;
  onNext: () => void;
  onPositive: (code: string) => void;
  onNegative: (code: string) => void;
  highlightCode?: string | null;
};

export function CountryPage({ album, country, onPrev, onNext, onPositive, onNegative, highlightCode }: Props) {
  const countryPages = useMemo(
    () => album.pages.filter((p) => p.country === country.id).sort((a, b) => a.page - b.page),
    [album.pages, country.id],
  );

  const total = country.stickers.length;
  const owned = country.stickers.filter((s) => s.hasSticker).length;
  const pct = Math.round((owned / total) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Country header */}
      <div className="glass-strong rounded-3xl p-4 sm:p-6 flex items-center gap-4 shadow-card">
        <button
          onClick={onPrev}
          className="h-11 w-11 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center transition active:scale-95 shrink-0"
          aria-label="País anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-glow"
            style={{ background: `linear-gradient(135deg, ${country.color}50, ${country.color}20)` }}
          >
            {/* {country.flag} */}
            <img style={{width: "90%", height: "auto"}} src={`/sticker-wallet/flags/${country.id}.png`} alt={`Bandeira ${country.name}`} loading="lazy" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold truncate">{country.name}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{owned}/{total} figurinhas</span>
              <span>•</span>
              <span className="font-semibold text-success">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-secondary/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${country.color}, var(--success))`,
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="h-11 w-11 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center transition active:scale-95 shrink-0"
          aria-label="Próximo país"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Album pages: vertical on mobile, horizontal on landscape/desktop */}
      <div className="grid grid-cols-1 landscape:grid-cols-2 md:grid-cols-2 gap-4">
        {countryPages.map((pg) => {
          const stickers = country.stickers.filter((s) => pg.stickers.includes(s.code));
          const pageOwned = stickers.filter((s) => s.hasSticker).length;
          return (
            <div key={pg.page} className="glass rounded-3xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Página</p>
                  <p className="text-lg font-bold">{String(pg.page).padStart(2, "0")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{pageOwned}/{stickers.length}</p>
                  <div className="w-20 h-1 mt-1 bg-secondary/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: `${(pageOwned / stickers.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stickers.map((s) => (
                  <StickerCard
                    key={s.code}
                    sticker={s}
                    countryId={country.id}
                    countryFlag={country.flag}
                    countryColor={country.color}
                    onPositive={() => onPositive(s.code)}
                    onNegative={() => onNegative(s.code)}
                    highlighted={highlightCode === s.code}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
