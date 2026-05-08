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
  return getItemTypeName(record) ?? "Inconnu";
};

const getItemTypeRecord = (item: unknown): UnknownRecord | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as UnknownRecord;
  return record.type && typeof record.type === "object" ? (record.type as UnknownRecord) : null;
};

const getItemTypeName = (item: unknown): string | null => {
  const type = getItemTypeRecord(item);

  if (type && typeof type === "object") {
    return readLocalizedString(type.name);
  }

  return null;
};

const getItemTypeId = (item: unknown): number | null => {
  const type = getItemTypeRecord(item);
  const record = item && typeof item === "object" ? (item as UnknownRecord) : null;
  return readNumber(type?.id) ?? readNumber(record?.typeId);
};

const getItemCategoryId = (item: unknown): number | null => {
  return readNumber(getItemTypeRecord(item)?.categoryId);
};

const getItemSuperTypeName = (item: unknown): string | null => {
  const superType = getItemTypeRecord(item)?.superType;

  if (superType && typeof superType === "object") {
    return readLocalizedString((superType as UnknownRecord).name);
  }

  return null;
};

const isQuestItem = (item: unknown): boolean => {
  const categoryId = getItemCategoryId(item);
  const typeName = getItemTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";
  const superTypeName = getItemSuperTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";

  return categoryId === 3 || typeName.includes("quête") || superTypeName.includes("quête");
};

const isTechnicalItem = (item: unknown): boolean => {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : null;
  const name = readLocalizedString(record?.name)?.toLocaleLowerCase("fr-FR") ?? "";
  const typeName = getItemTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";
  const superTypeName = getItemSuperTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";
  const iconUrl = readString(record?.img);

  return (
    name.startsWith("(mj)") ||
    name.includes("almanax méryde") ||
    typeName.includes("invisible") ||
    typeName.includes("roleplay") ||
    superTypeName.includes("bonus de jeu de rôle") ||
    iconUrl === "https://api.dofusdb.fr/img/items/0.png" ||
    iconUrl?.endsWith("/0.png") === true
  );
};

const isCosmeticItem = (item: unknown): boolean => {
  const categoryId = getItemCategoryId(item);
  const typeName = getItemTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";
  const superTypeName = getItemSuperTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";

  return (
    categoryId === 5 ||
    typeName.includes("apparat") ||
    typeName.includes("attitude") ||
    typeName.includes("titre") ||
    typeName.includes("ornement") ||
    superTypeName.includes("cosmétique")
  );
};

const isValidDofusItem = (item: unknown): boolean => {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : null;
  const id = readNumber(record?.id);
  const name = readLocalizedString(record?.name);
  const iconUrl = readString(record?.img);

  return id !== null && name !== null && /[a-zA-ZÀ-ÿ0-9]/.test(name) && iconUrl !== null && !isTechnicalItem(item);
};

const isResourceMarketItem = (item: unknown): boolean => {
  const record = item && typeof item === "object" ? (item as UnknownRecord) : null;
  const categoryId = getItemCategoryId(item);
  const typeName = getItemTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";
  const superTypeName = getItemSuperTypeName(item)?.toLocaleLowerCase("fr-FR") ?? "";

  if (categoryId !== 2 || !isValidDofusItem(item) || isQuestItem(item) || isCosmeticItem(item)) {
    return false;
  }

  if (record?.isSaleable === false) {
    return false;
  }

  if (
    typeName.includes("objet de mission") ||
    typeName.includes("objet de dons") ||
    typeName.includes("visage") ||
    typeName.includes("corps") ||
    typeName.includes("poses") ||
    typeName.includes("tatouage") ||
    typeName.includes("haïku")
  ) {
    return false;
  }

  if (
    typeName.includes("ressource de quête") ||
    superTypeName.includes("malédiction") ||
    superTypeName.includes("bénédiction") ||
    superTypeName.includes("suiveur")
  ) {
    return false;
  }

  return true;
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

const formatTypeKey = (item: unknown): string => {
  const typeId = getItemTypeId(item);
  const typeName = getItemTypeName(item) ?? "Inconnu";
  const categoryId = getItemCategoryId(item);
  const superTypeName = getItemSuperTypeName(item) ?? "Inconnu";

  return `${typeId ?? "unknown"}\t${typeName}\tcategory:${categoryId ?? "unknown"}\tsuper:${superTypeName}`;
};

const logItemTypeSummary = (items: unknown[], label: string) => {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = formatTypeKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  console.log(`${label}: ${counts.size} type/category group(s)`);
  for (const [key, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    const [typeId, typeName, category, superType] = key.split("\t");
    console.log(`- typeId=${typeId} | ${typeName} | ${category} | ${superType} | count=${count}`);
  }
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
  console.log(`Fetched ${rawItems.length} raw item(s).`);
  logItemTypeSummary(rawItems, "DofusDB raw item types");

  const marketItems = rawItems.filter(isResourceMarketItem);
  logItemTypeSummary(marketItems, "Kept HDV resource item types");

  const normalizedItems = normalizeDofusItems(
    marketItems.map(normalizeDofusDbItem).filter((item): item is DofusItem => item !== null)
  );

  console.log(`Kept ${marketItems.length} market-relevant raw item(s).`);
  console.log(`Normalized ${normalizedItems.length} item(s).`);

  if (normalizedItems.length === 0) {
    if (await cacheExists()) {
      console.warn(`No item was kept after filtering. Existing cache preserved at ${outputPath}`);
      return;
    }

    throw new Error("No item was kept after filtering and no existing cache was found. Cache file was not updated.");
  }

  await writeCache(normalizedItems);
  console.log(`Wrote ${normalizedItems.length} normalized item(s) to ${outputPath}`);
};

sync().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
