import { useMemo } from "react";
import { Trophy, Layers, AlertCircle, Sparkles, TrendingUp, Wallet } from "lucide-react";
// import type { Album } from "@/lib/album-data";
import type { Album } from "../../lib/album-data";

const STICKER_PRICE = 1.0; // R$ per sticker (default)

export function Dashboard({ album }: { album: Album }) {
  const stats = useMemo(() => {
    let total = 0, owned = 0, missing = 0, extras = 0;
    const byCountry: Array<{
      id: string; name: string; flag: string; color: string;
      owned: number; total: number; extras: number; pct: number;
    }> = [];

    for (const c of album.countries) {
      let co = 0, ce = 0;
      for (const s of c.stickers) {
        total++;
        if (s.hasSticker) owned++;
        else missing++;
        extras += s.positiveQty;
        if (s.hasSticker) co++;
        ce += s.positiveQty;
      }
      byCountry.push({
        id: c.id, name: c.name, flag: c.flag, color: c.color,
        owned: co, total: c.stickers.length, extras: ce,
        pct: Math.round((co / c.stickers.length) * 100),
      });
    }

    const pagesStats = album.pages.map((p) => {
      const country = album.countries.find((c) => c.id === p.country);
      const stickers = country?.stickers.filter((s) => p.stickers.includes(s.code)) ?? [];
      const o = stickers.filter((s) => s.hasSticker).length;
      return { page: p.page, country: p.country, owned: o, total: stickers.length, complete: o === stickers.length };
    });

    const pagesComplete = pagesStats.filter((p) => p.complete).length;
    const mostComplete = [...byCountry].sort((a, b) => b.pct - a.pct)[0];
    const mostMissing = [...byCountry].sort((a, b) => a.pct - b.pct)[0];

    return {
      total, owned, missing, extras,
      pct: Math.round((owned / total) * 100),
      invested: (owned + extras) * STICKER_PRICE,
      byCountry, pagesStats, pagesComplete,
      mostComplete, mostMissing,
    };
  }, [album]);

  return (
    <div className="space-y-4">
      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Layers className="h-5 w-5" />} label="Total" value={stats.total} accent="text-foreground" />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Completas" value={stats.owned} accent="text-success" />
        <StatCard icon={<AlertCircle className="h-5 w-5" />} label="Faltantes" value={stats.missing} accent="text-destructive" />
        <StatCard icon={<Sparkles className="h-5 w-5" />} label="Extras" value={stats.extras} accent="text-[--color-gold]" />
      </div>

      {/* Progress + investment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 glass rounded-3xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <p className="text-sm font-medium text-muted-foreground">Progresso geral</p>
            </div>
            <p className="text-2xl font-bold text-gradient">{stats.pct}%</p>
          </div>
          <div className="h-3 bg-secondary/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${stats.pct}%`,
                background: "var(--gradient-hero)",
              }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Páginas completas</p>
              <p className="text-lg font-bold">{stats.pagesComplete}/{stats.pagesStats.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Coleção</p>
              <p className="text-lg font-bold">{stats.owned}/{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-info" />
            <p className="text-sm font-medium text-muted-foreground">Valor investido</p>
          </div>
          <p className="text-3xl font-bold">R$ {stats.invested.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Base: R$ {STICKER_PRICE.toFixed(2)} por figurinha
          </p>
        </div>
      </div>

      {/* Highlights */}
      {stats.mostComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <HighlightCard
            title="País mais completo"
            country={stats.mostComplete}
            accent="success"
          />
          <HighlightCard
            title="Mais faltantes"
            country={stats.mostMissing!}
            accent="destructive"
          />
        </div>
      )}

      {/* By country */}
      <div className="glass rounded-3xl p-5 shadow-card">
        <p className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Por país</p>
        <div className="space-y-3">
          {stats.byCountry.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                // style={{ background: `linear-gradient(135deg, ${c.color}50, ${c.color}20)` }}
              >
                {/* {c.flag} */}
                <img style={{width: "90%", height: "auto"}} src={`/sticker-wallet/flags/${c.id}.png`} alt={`Bandeira ${c.name}`} loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium truncate">{c.name}</p>
                  <div className="flex items-center gap-2 text-xs">
                    {c.extras > 0 && (
                      <span className="text-[--color-gold]">+{c.extras}</span>
                    )}
                    <span className="font-mono">{c.owned}/{c.total}</span>
                    <span className="text-success font-semibold w-10 text-right">{c.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${c.pct}%`,
                      background: `linear-gradient(90deg, ${c.color}, var(--success))`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: string }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-card">
      <div className={`flex items-center gap-2 ${accent}`}>{icon}<span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span></div>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function HighlightCard({ title, country, accent }: { title: string; country: any; accent: "success" | "destructive" }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-card flex items-center gap-4">
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl"
        // style={{ background: `linear-gradient(135deg, ${country.color}50, ${country.color}20)` }}
      >
        {/* {country.flag} */}
        <img style={{width: "90%", height: "auto"}} src={`/sticker-wallet/flags/${country.id}.png`} alt={`Bandeira ${country.name}`} loading="lazy" />
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="text-lg font-bold">{country.name}</p>
        <p className={`text-sm font-semibold text-${accent}`}>{country.pct}% completo</p>
      </div>
    </div>
  );
}
