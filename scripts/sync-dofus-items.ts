import { access, mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeDofusItems, type DofusItem } from "../lib/items/dofus-items";

type UnknownRecord = Record<string, unknown>;

type DofusDbPage = {
  data: unknown[];
  limit: number;
  skip: number;
  total: number;
};

const defaultBaseUrl = "https://api.dofusdb.fr/items";
const pageSize = Number(process.env.DOFUS_ITEMS_PAGE_SIZE ?? 500);
const outputPath = process.env.DOFUS_ITEMS_OUTPUT_PATH ?? path.join(process.cwd(), "public", "data", "dofus-items.json");
const tempOutputPath = `${outputPath}.tmp`;
const baseUrl = process.env.DOFUS_ITEMS_API_URL ?? defaultBaseUrl;

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

const readLocalizedString = (value: unknown): string | null => {
  if (typeof value === "string") {
    return readString(value);
  }

  if (value && typeof value === "object") {
    const record = value as UnknownRecord;
    return readString(record.fr) ?? readString(record.en) ?? readString(record.name);
  }

  return null;
};

const readItemType = (record: UnknownRecord): string => {
  const type = record.type;

  if (type && typeof type === "object") {
    const typeRecord = type as UnknownRecord;
    return readLocalizedString(typeRecord.name) ?? "Inconnu";
  }

  return readLocalizedString(type) ?? "Inconnu";
};

const normalizeDofusDbItem = (item: unknown): DofusItem | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as UnknownRecord;
  const id = readNumber(record.id);
  const name = readLocalizedString(record.name);

  if (id === null || name === null) {
    return null;
  }

  return {
    id,
    name,
    type: readItemType(record),
    level: readNumber(record.level),
    iconUrl: readString(record.img)
  };
};

const buildPageUrl = (skip: number): string => {
  const url = new URL(baseUrl);
  url.searchParams.set("$limit", String(pageSize));
  url.searchParams.set("$skip", String(skip));
  return url.toString();
};

const readDofusDbPage = (payload: unknown, url: string): DofusDbPage => {
  if (!payload || typeof payload !== "object") {
    throw new Error(`${url} returned an invalid JSON payload`);
  }

  const record = payload as UnknownRecord;
  const data = Array.isArray(record.data) ? record.data : null;
  const total = readNumber(record.total);
  const limit = readNumber(record.limit);
  const skip = readNumber(record.skip);

  if (!data || total === null || limit === null || skip === null) {
    throw new Error(`${url} returned an unexpected DofusDB page shape`);
  }

  return {
    data,
    total,
    limit,
    skip
  };
};

const fetchDofusDbPage = async (skip: number): Promise<DofusDbPage> => {
  const url = buildPageUrl(skip);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json"
      },
      signal: AbortSignal.timeout(30_000)
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`${url} returned ${response.status} ${response.statusText}${body ? `: ${body.slice(0, 300)}` : ""}`);
    }

    return readDofusDbPage(await response.json(), url);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${url} failed: ${error.message}`);
    }

    throw new Error(`${url} failed with an unknown error`);
  }
};

const cacheExists = async (): Promise<boolean> => {
  try {
    await access(outputPath);
    return true;
  } catch {
    return false;
  }
};

const writeCache = async (items: DofusItem[]) => {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(tempOutputPath, `${JSON.stringify(items)}\n`, "utf8");
  await rename(tempOutputPath, outputPath);
};

const sync = async () => {
  console.log(`Syncing Dofus items from DofusDB: ${baseUrl}`);
  console.log(`Requested page size: ${pageSize}`);

  const firstPage = await fetchDofusDbPage(0);
  const pages: DofusDbPage[] = [firstPage];
  let fetchedCount = firstPage.data.length;
  const effectivePageSize = Math.max(firstPage.data.length, 1);
  const totalPages = Math.ceil(firstPage.total / effectivePageSize);

  console.log(`DofusDB reports ${firstPage.total} item(s) across about ${totalPages} page(s).`);
  console.log(`Effective page size: ${effectivePageSize}`);

  while (fetchedCount < firstPage.total) {
    const page = await fetchDofusDbPage(fetchedCount);
    pages.push(page);
    fetchedCount += page.data.length;
    console.log(`Fetched ${Math.min(fetchedCount, firstPage.total)} / ${firstPage.total} item(s)...`);

    if (page.data.length === 0) {
      throw new Error(`DofusDB returned an empty page at skip=${page.skip}. Stopping to avoid an infinite loop.`);
    }
  }

  const rawItems = pages.flatMap((page) => page.data);
  const normalizedItems = normalizeDofusItems(
    rawItems.map(normalizeDofusDbItem).filter((item): item is DofusItem => item !== null)
  );

  console.log(`Fetched ${rawItems.length} raw item(s).`);
  console.log(`Normalized ${normalizedItems.length} item(s).`);

  if (normalizedItems.length === 0) {
    if (await cacheExists()) {
      console.warn(`No item was normalized. Existing cache preserved at ${outputPath}`);
      return;
    }

    await writeCache([]);
    console.warn(`No item was normalized and no cache existed. Wrote empty cache to ${outputPath}`);
    return;
  }

  await writeCache(normalizedItems);
  console.log(`Wrote ${normalizedItems.length} normalized item(s) to ${outputPath}`);
};

sync().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
