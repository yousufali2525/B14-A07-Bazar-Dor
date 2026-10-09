import { parseNum } from "./bn";
import { Category, Market, Product } from "./types";

type Raw = Record<string, any>;

const BASES = [
  process.env.NEXT_PUBLIC_API_URL_2 ?? "https://api.abcz.workers.dev/api/bazardor",
  process.env.NEXT_PUBLIC_API_URL_1 ?? "https://api.api-store.workers.dev/api/bazardor",
];

function pick(source: Raw | undefined, keys: string[]) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

async function request(path: string) {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${path}`, { next: { revalidate: 300 } });
      if (res.ok) return await res.json();
    } catch {}
  }
  return null;
}

function toList(json: any): Raw[] {
  if (Array.isArray(json)) return json;
  if (!json || typeof json !== "object") return [];
  for (const key of ["data", "products", "categories", "items", "results"]) {
    if (Array.isArray(json[key])) return json[key];
  }
  return [];
}

function toSingle(json: any): Raw | null {
  const data = json?.data ?? json?.product ?? json?.category ?? json;
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data;
}

function readChange(raw: Raw, today: number, yesterday: number): number {
  if (raw.change && typeof raw.change === "object") {
    const pct = parseNum(raw.change.pct ?? raw.change.percent ?? raw.change.value);
    const dir = String(raw.change.dir ?? raw.change.direction ?? "").toLowerCase();
    if (dir === "down" || dir === "dec" || dir === "fall") {
      return -Math.abs(pct);
    }
    if (dir === "up" || dir === "inc" || dir === "rise") {
      return Math.abs(pct);
    }
    return pct;
  }

  const value = pick(raw, [
    "changePercent",
    "change_percent",
    "percentChange",
    "percent_change",
    "changePct",
    "percent",
  ]);

  if (value !== undefined) {
    let n = parseNum(value);
    const text = typeof value === "string" ? value : "";
    const dir = String(pick(raw, ["trend", "direction"]) ?? "").toLowerCase();
    if (text.includes("▼") || /down|fall|dec/.test(dir)) n = -Math.abs(n);
    else if (text.includes("▲") || /up|rise|inc/.test(dir)) n = Math.abs(n);
    return Math.round(n * 10) / 10;
  }

  if (today > 0 && yesterday > 0 && today !== yesterday) {
    const diff = today - yesterday;
    const calcPct = (diff / yesterday) * 100;
    return Math.round(calcPct * 10) / 10;
  }

  return 0;
}

function readMarkets(raw: Raw): Market[] {
  const source = pick(raw, [
    "markets",
    "bazars",
    "bazaars",
    "bazar",
    "marketPrices",
    "market_prices",
  ]);

  if (Array.isArray(source)) {
    return source
      .map((m: Raw) => {
        const name = String(pick(m, ["market", "name", "nameBn", "bazar", "location", "title"]) ?? "বাজার");
        const minVal = parseNum(pick(m, ["min", "minPrice", "min_price"]));
        const maxVal = parseNum(pick(m, ["max", "maxPrice", "max_price"]));
        let p = parseNum(pick(m, ["price", "value", "rate", "amount"]));

        if (p <= 0 && minVal > 0 && maxVal > 0) {
          p = Math.round((minVal + maxVal) / 2);
        } else if (p <= 0 && minVal > 0) {
          p = minVal;
        }

        return {
          name,
          price: p,
          min: minVal > 0 ? minVal : p,
          max: maxVal > 0 ? maxVal : p,
          division: String(pick(m, ["division", "district", "city"]) ?? ""),
        };
      })
      .filter((m) => m.price > 0 || m.min > 0);
  }

  return [];
}

function formatUnitName(unitRaw: any): string {
  if (!unitRaw) return "প্রতি কেজি";
  const str = String(unitRaw).toLowerCase().trim();
  if (str === "kg" || str === "কেজি") return "প্রতি কেজি";
  if (str === "litre" || str === "liter" || str === "লিটার") return "প্রতি লিটার";
  if (str === "dozen" || str === "ডজন") return "প্রতি ডজন";
  if (str === "piece" || str === "পিস" || str === "item") return "প্রতি পিস";
  if (str === "hali" || str === "হালি") return "প্রতি হালি";
  return String(unitRaw).startsWith("প্রতি") ? String(unitRaw) : `প্রতি ${unitRaw}`;
}

export function normalizeProduct(raw: Raw): Product {
  const markets = readMarkets(raw);
  const prices = markets.map((m) => m.price).filter((p) => p > 0);
  const average = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  const today = parseNum(
    pick(raw, [
      "today",
      "todayPrice",
      "today_price",
      "currentPrice",
      "current_price",
      "price",
      "avgPrice",
      "averagePrice",
    ])
  );

  const yesterday = parseNum(
    pick(raw, ["yesterday", "yesterdayPrice", "yesterday_price", "previousPrice", "prevPrice", "lastWeek"])
  );

  const price = today > 0 ? today : average;
  const change = readChange(raw, price, yesterday);

  const categoryRaw = pick(raw, ["category", "categorySlug", "category_slug"]);
  const category =
    categoryRaw && typeof categoryRaw === "object"
      ? String(pick(categoryRaw, ["slug", "id"]) ?? "")
      : String(categoryRaw ?? "");

  const id = String(pick(raw, ["id", "_id", "slug"]) ?? "");
  const slug = String(pick(raw, ["slug", "id", "_id"]) ?? id);

  const allMins = markets.map((m: any) => m.min).filter((n) => typeof n === "number" && n > 0);
  const allMaxs = markets.map((m: any) => m.max).filter((n) => typeof n === "number" && n > 0);

  return {
    id,
    slug,
    name: String(pick(raw, ["nameBn", "name_bn", "bnName", "name", "title"]) ?? "পণ্য"),
    emoji: String(pick(raw, ["image", "emoji", "icon", "categoryIcon"]) ?? "🛒"),
    unit: formatUnitName(pick(raw, ["unit", "unitBn", "unit_bn"])),
    price,
    today: price,
    yesterday: yesterday > 0 ? yesterday : price,
    change,
    category,
    description: String(pick(raw, ["description", "summary", "subtitle", "marketSummary", "market_summary"]) ?? ""),
    tags: [category].filter(Boolean),
    markets,
    min: parseNum(pick(raw, ["minPrice", "min_price", "min"])) || (allMins.length ? Math.min(...allMins) : price),
    max: parseNum(pick(raw, ["maxPrice", "max_price", "max"])) || (allMaxs.length ? Math.max(...allMaxs) : price),
    avg: parseNum(pick(raw, ["avgPrice", "averagePrice", "avg_price", "avg"])) || average || price,
  };
}

export function normalizeCategory(raw: Raw): Category {
  const slug = String(pick(raw, ["slug", "id", "_id"]) ?? "");
  return {
    slug,
    name: String(pick(raw, ["nameBn", "name_bn", "name", "title"]) ?? slug),
    icon: String(pick(raw, ["icon", "emoji", "image", "categoryIcon"]) ?? "🛒"),
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  const path = category && category !== "all" ? `/products?category=${encodeURIComponent(category)}` : "/products";
  const json = await request(path);
  return toList(json).map(normalizeProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const isNumeric = /^\d+$/.test(slug);
  if (isNumeric) {
    const json = await request(`/products/${encodeURIComponent(slug)}`);
    const raw = toSingle(json);
    if (raw && !raw.error) return normalizeProduct(raw);
  }

  const all = await getProducts();
  const match = all.find(
    (p) => p.slug === slug || String(p.id) === String(slug)
  );
  if (match) return match;

  const json = await request(`/products/${encodeURIComponent(slug)}`);
  const raw = toSingle(json);
  if (!raw || raw.error) return null;
  return normalizeProduct(raw);
}

export async function getCategories(): Promise<Category[]> {
  const json = await request("/categories");
  return toList(json).map(normalizeCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const json = await request(`/categories/${encodeURIComponent(slug)}`);
  const raw = toSingle(json);
  if (!raw) return null;
  return normalizeCategory(raw);
}