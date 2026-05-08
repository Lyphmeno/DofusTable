import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeDofusItems, type DofusItem } from "../lib/items/dofus-items";

type UnknownRecord = Record<string, unknown>;

const DEFAULT_ENDPOINTS = [
  "https://fr.dofus.dofapi.fr/equipments",
  "https://fr.dofus.dofapi.fr/weapons",
  "https://fr.dofus.dofapi.fr/resources",
  "https://fr.dofus.dofapi.fr/consumables",
  "https://fr.dofus.dofapi.fr/pets",
  "https://fr.dofus.dofapi.fr/mounts"
];

const outputPath = process.env.DOFUS_ITEMS_OUTPUT_PATH ?? path.join(process.cwd(), "public", "data", "dofus-items.json");
const tempOutputPath = `${outputPath}.tmp`;
const endpoints = (process.env.DOFUS_ITEMS_API_URLS ?? process.env.DOFUS_ITEMS_API_URL)
  ?.split(",")
  .map((url) => url.trim())
  .filter(Boolean) ?? DEFAULT_ENDPOINTS;

const readString = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return null;
};

const readNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const readNestedName = (value: unknown): string | null => {
  if (typeof value === "string") {
    return readString(value);
  }

  if (value && typeof value === "object") {
    const record = value as UnknownRecord;
    return readString(record.name) ?? readString(record.fr) ?? readString(record.en);
  }

  return null;
};

const getPayloadItems = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const candidates = [record.data, record.items, record.results];
    const match = candidates.find(Array.isArray);

    if (match) {
      return match;
    }
  }

  return [];
};

const normalizeApiItem = (item: unknown): DofusItem | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as UnknownRecord;
  const id = readNumber(record.id ?? record.ankamaId ?? record.objectId);
  const name = readNestedName(record.name);

  if (id === null || name === null) {
    return null;
  }

  return {
    id,
    name,
    type: readNestedName(record.type) ?? readNestedName(record.itemType) ?? "Inconnu",
    level: readNumber(record.level),
    iconUrl: readString(record.iconUrl) ?? readString(record.imgUrl) ?? readString(record.imageUrl) ?? readString(record.image)
  };
};

const fetchEndpointItems = async (url: string): Promise<DofusItem[]> => {
  const response = await fetch(url, {
    headers: {
      accept: "application/json"
    },
    signal: AbortSignal.timeout(20_000)
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  const payload = await response.json();
  return getPayloadItems(payload).map(normalizeApiItem).filter((item): item is DofusItem => item !== null);
};

const sync = async () => {
  console.log(`Syncing Dofus items from ${endpoints.length} endpoint(s)...`);

  const results = await Promise.allSettled(endpoints.map(fetchEndpointItems));
  const items = results.flatMap((result, index) => {
    const endpoint = endpoints[index];

    if (result.status === "fulfilled") {
      console.log(`- ${endpoint}: ${result.value.length} item(s)`);
      return result.value;
    }

    console.warn(`- ${endpoint}: skipped (${result.reason instanceof Error ? result.reason.message : "unknown error"})`);
    return [];
  });

  const normalizedItems = normalizeDofusItems(items);

  if (normalizedItems.length === 0) {
    throw new Error("No Dofus items were fetched. Cache file was not updated.");
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(tempOutputPath, `${JSON.stringify(normalizedItems)}\n`, "utf8");
  await rename(tempOutputPath, outputPath);

  console.log(`Wrote ${normalizedItems.length} normalized item(s) to ${outputPath}`);
};

sync().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
