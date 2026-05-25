import { Minus, Plus } from "lucide-react";
// import { type Sticker, stickerStatus } from "@/lib/album-data";
import { type Sticker, stickerStatus } from "../../lib/album-data";
// import { cn } from "@/lib/utils";
import { cn } from "../../lib/utils"

type Props = {
  sticker: Sticker;
  countryId: string;
  countryFlag: string;
  countryColor: string;
  onPositive: () => void;
  onNegative: () => void;
  highlighted?: boolean;
};

export function StickerCard({ sticker, countryId, countryFlag, countryColor, onPositive, onNegative, highlighted }: Props) {
  const status = stickerStatus(sticker);

  const ring =
    status === "missing"
      ? "ring-destructive/60"
      : status === "extras"
        ? "ring-[--color-gold]/70"
        : "ring-success/60";

  const badge =
    status === "missing"
      ? "bg-destructive/20 text-destructive"
      : status === "extras"
        ? "bg-[--color-gold]/20 text-[--color-gold]"
        : "bg-success/20 text-success";

  const label = status === "missing" ? "Faltando" : status === "extras" ? `+${sticker.positiveQty}` : "Completa";

  return (
    <div
      className={cn(
        // "glass rounded-2xl p-3 flex flex-col gap-2 ring-1 transition-all duration-300 shadow-card",
        "glass p-2 flex flex-col gap-2 ring-1 transition-all duration-300 shadow-card",
        ring,
        highlighted && "animate-focus",
      )}
    >
      <div
        // className="aspect-[3/4] rounded-xl flex items-center justify-center text-4xl overflow-hidden relative"
        className="aspect-[3/4] flex items-center justify-center text-4xl overflow-hidden relative"
        style={{
          background: `linear-gradient(145deg, ${countryColor}40, ${countryColor}10)`,
          border: `1px solid ${countryColor}55`,
        }}
      >
        {/* {sticker.img ? (
          <img style={{height: "90%"}} src={`data:image/png;base64,${sticker.img}`} alt={sticker.name ?? sticker.code} />
        ) : (
          <span className="text-5xl drop-shadow-lg">{countryFlag}</span>
        )} */}
        {/* <span className="absolute bottom-1 right-2 text-[10px] font-mono text-foreground/70"> */}
        <span className="absolute top-1 right-2 text-[10px] font-mono text-foreground/70">
          {sticker.code}
        </span>
        {sticker.type === "team" && (
          <>
            <img style={{ width: "90%", height: "auto" }} src={`/sticker-wallet/shields/${countryId}.png`} alt={`Escudo `} loading="lazy" />
            <span className="absolute top-1 left-2 text-[9px] uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded">
              Escudo
            </span>
          </>
        )}
        {sticker.type === "squad" && (
          <>
            <span className="text-5xl drop-shadow-lg">{countryFlag}</span>
            <span className="absolute top-1 left-2 text-[9px] uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded">
              Time
            </span>
          </>
        )}
        {sticker.type === "player" && (
          <>
            <span className="text-5xl drop-shadow-lg">{countryFlag}</span>
            <p className="absolute p-2 bottom-1 text-xs">{sticker.name}</p>
          </>
        )}
      </div>

      {/* <div className="flex items-center justify-between gap-1"> */}
      <div className="flex gap-2 items-center justify-between">
        {/* <p className="text-xs font-medium truncate">{sticker.name}</p> */}
        {/* <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap", badge)}>
          {label}
        </span> */}
        {/* </div> */}

        {/* <div className="flex gap-2">
        <button
          type="button"
          onClick={onNegative}
          className="flex-1 h-9 rounded-lg bg-destructive/15 hover:bg-destructive/25 text-destructive flex items-center justify-center transition active:scale-95"
          aria-label="Faltante"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onPositive}
          className="flex-1 h-9 rounded-lg bg-success/15 hover:bg-success/25 text-success flex items-center justify-center transition active:scale-95"
          aria-label="Adicionar"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div> */}

        <button
          type="button"
          onClick={onNegative}
          className="w-7 h-7 rounded-lg bg-destructive/15 hover:bg-destructive/25 text-destructive flex items-center justify-center transition active:scale-95"
          aria-label="Faltante"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap", badge)}>{label}</span>

        <button
          type="button"
          onClick={onPositive}
          className="w-7 h-7 rounded-lg bg-success/15 hover:bg-success/25 text-success flex items-center justify-center transition active:scale-95"
          aria-label="Adicionar"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
