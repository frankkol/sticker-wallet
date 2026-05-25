import { useCallback, useEffect, useMemo, useState } from "react";
import { type Album, createEmptyAlbum, validateAlbum } from "./album-data";

const KEY = "wc2026-album-v1";

export function loadAlbum(): Album | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return validateAlbum(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveAlbum(album: Album) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(album));
}

export function clearAlbum() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function useAlbum() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAlbum(loadAlbum());
    setReady(true);
  }, []);

  useEffect(() => {
    if (album) saveAlbum(album);
  }, [album]);

  const create = useCallback(() => setAlbum(createEmptyAlbum()), []);
  const importAlbum = useCallback((data: Album) => setAlbum(data), []);
  const reset = useCallback(() => {
    clearAlbum();
    setAlbum(null);
  }, []);

  const updateSticker = useCallback(
    (code: string, delta: { positive?: number; negative?: number }) => {
      setAlbum((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          countries: prev.countries.map((c) => ({
            ...c,
            stickers: c.stickers.map((s) => {
              if (s.code !== code) return s;
              // Total count = (has ? 1 : 0) + positiveQty extras
              let total = (s.hasSticker ? 1 : 0) + s.positiveQty;
              const step = (delta.positive ?? 0) - (delta.negative ? Math.abs(delta.negative) : 0);
              total = Math.max(0, total + step);
              const hasSticker = total >= 1;
              const positiveQty = hasSticker ? total - 1 : 0;
              const negativeQty = hasSticker ? 0 : -1;
              return { ...s, positiveQty, negativeQty, hasSticker };
            }),
          })),
        };
      });
    },
    [],
  );

  const stickerIndex = useMemo(() => {
    const idx = new Map<string, { sticker: any; country: any }>();
    if (!album) return idx;
    for (const c of album.countries) {
      for (const s of c.stickers) idx.set(s.code, { sticker: s, country: c });
    }
    return idx;
  }, [album]);

  return { album, ready, create, importAlbum, reset, updateSticker, stickerIndex };
}
