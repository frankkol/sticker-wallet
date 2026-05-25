
// Mock data and helpers for the World Cup 2026 sticker album.
import { COUNTRY_SEED } from '../data/countrySeed';
import { PLAYER_NAMES } from '../data/playerSeed';

const HAS_STICKER_DEFAULT = true; // if true this is album complete.
const NEGATIVE_QTY_DEFAULT = HAS_STICKER_DEFAULT ? 0 : -1;

export type Sticker = {
  code: string;
  type: "team" | "squad" | "player";
  name: string;
  hasSticker: boolean;
  positiveQty: number;
  negativeQty: number;
  page: number;
  image?: string;
};

export type Country = {
  id: string;
  name: string;
  flag: string; // emoji or data URI
  color: string; // hex for accent
  stickers: Sticker[];
};

export type AlbumPage = {
  page: number;
  country: string;
  stickers: string[];
};

export type Album = {
  worldCup: string;
  createdAt: string;
  countries: Country[];
  pages: AlbumPage[];
};

function buildStickers(country: Omit<Country, "stickers">, startPage: number): Sticker[] {
  const stickers: Sticker[] = [];
  // 1 escudo + 1 time + 18 jogadores = 20
  stickers.push({
    code: `${country.id}1`,
    type: "team",
    name: "Escudo",
    hasSticker: HAS_STICKER_DEFAULT,
    positiveQty: 0,
    negativeQty: NEGATIVE_QTY_DEFAULT,
    page: startPage,
  });
  for (let i = 1; i < 12; i++) {
    // const num = String(i + 1).padStart(2, "0");
    stickers.push({
      code: `${country.id}${i + 1}`,
      type: "player",
      name: PLAYER_NAMES[country.id][i-1 % PLAYER_NAMES[country.id].length],
      hasSticker: HAS_STICKER_DEFAULT,
      positiveQty: 0,
      negativeQty: NEGATIVE_QTY_DEFAULT,
      page: i < 10 ? startPage : startPage + 1,
    });
  }
  stickers.push({
    code: `${country.id}13`,
    type: "squad",
    name: "Time Completo",
    hasSticker: HAS_STICKER_DEFAULT,
    positiveQty: 0,
    negativeQty: NEGATIVE_QTY_DEFAULT,
    page: startPage + 1,
  });
  for (let i = 13; i < 20; i++) {
    // const num = String(i + 1).padStart(2, "0");
    stickers.push({
      code: `${country.id}${i + 1}`,
      type: "player",
      name: PLAYER_NAMES[country.id][i-2 % PLAYER_NAMES[country.id].length],
      hasSticker: HAS_STICKER_DEFAULT,
      positiveQty: 0,
      negativeQty: NEGATIVE_QTY_DEFAULT,
      page: startPage + 1,
    });
  }
  return stickers;
}

export function createEmptyAlbum(): Album {
  const countries: Country[] = [];
  const pages: AlbumPage[] = [];
  let pageNum = 8;
  for (const seed of COUNTRY_SEED) {
    const stickers = buildStickers(seed, pageNum);
    countries.push({ ...seed, stickers });

    const p1 = stickers.filter((s) => s.page === pageNum).map((s) => s.code);
    const p2 = stickers.filter((s) => s.page === pageNum + 1).map((s) => s.code);
    pages.push({ page: pageNum, country: seed.id, stickers: p1 });
    pages.push({ page: pageNum + 1, country: seed.id, stickers: p2 });
    pageNum += 2;
    if(pageNum == 56) pageNum = 58;
  }
  return {
    worldCup: "2026",
    createdAt: new Date().toISOString(),
    countries,
    pages,
  };
}

export function validateAlbum(data: unknown): data is Album {
  if (!data || typeof data !== "object") return false;
  const a = data as Album;
  if (!Array.isArray(a.countries) || !Array.isArray(a.pages)) return false;
  for (const c of a.countries) {
    if (!c.id || !c.name || !Array.isArray(c.stickers)) return false;
    for (const s of c.stickers) {
      if (typeof s.code !== "string" || typeof s.hasSticker !== "boolean") return false;
    }
  }
  return true;
}

export function stickerStatus(s: Sticker): "missing" | "extras" | "owned" {
  if (!s.hasSticker || s.negativeQty < 0) return "missing";
  if (s.positiveQty > 0) return "extras";
  return "owned";
}
